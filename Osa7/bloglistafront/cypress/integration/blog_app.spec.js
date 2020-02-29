describe('Blog app', function () {
    const user = { name: 'testName', username: 'testUsername', password: 'testPassword' }
    const blog = { author: 'testAuthor', title: 'testTitle', url: 'testUrl', likes: 13 }
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3001/api/test/reset')
        cy.createUser(user)
    })

    it('Login from is shown', function () {
        cy.contains('Log in to application')
        cy.contains('username')
        cy.contains('password')
        cy.contains('login')
    })

    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.contains('login').click()
            cy.get('#username').type('testUsername')
            cy.get('#password').type('testPassword')
            cy.get('#login-button').click()
            cy.contains('testUsername logged in')
        })

        it('fails with wrong credentials', function () {
            cy.contains('login').click()
            cy.get('#username').type('testUsername')
            cy.get('#password').type('testPass')
            cy.get('#login-button').click()
            cy.get('.errormessage')
                .should('contain', 'wrong username or password')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
            cy.get('html').should('not.contain', 'testUsername logged in')
        })
    })

    describe('When logged in', () => {
        beforeEach(function () {
            cy.login({ username: user.username, password: user.password })
        })
        it('A blog can be created', function () {
            cy.contains('new blog').click()
            cy.get('#author').type('test2Author')
            cy.get('#title').type('test2Title')
            cy.get('#url').type('test2Url')
            cy.get('#blogSubmit').click()
            cy.contains('test2Title by test2Author')
        })

        it('A blog can be liked', function () {
            cy.createBlog(blog)
            cy.contains('view').click()
            cy.contains('likes 13')
            cy.contains('like').click()
            cy.contains('likes 14')
        })

        it('A blog can be deleted by person who added it', function () {
            cy.createBlog(blog)
            cy.contains(`${blog.title} by ${blog.author}`)
            cy.contains('view').click()
            cy.contains('remove').click()
            cy.get('.message').should('contain', `removed blog ${blog.title} by ${blog.author}`)
            cy.get('html').should('not.contain', `<div>${blog.title} by ${blog.author}</div>`)
        })

        it('A blog cannot be deleted by person who did not add it', function () {
            cy.createBlog(blog)
            cy.contains(`${blog.title} by ${blog.author}`)
            const newUser = { username: 'newUsername', name: 'newName', password: 'newPassword' }
            cy.createUser(newUser)
            cy.login(newUser)
            cy.contains('view').click()
            cy.get('.message').should('not.exist')
            cy.contains(`${blog.title} by ${blog.author}`)
        })

        it('blogs are in order of most likes first', function () {
            for (let i = 0; i < 10; i++) {
                cy.createBlog({ author: `author${i}`, title: `title${i}`, url: `url${i}`, likes: i })
            }
            cy.get('#titleAndAuthor').then(blogs => {
                for (let i = 0; i < 10; i++) {
                    cy.wrap(blogs[i]).contains(`title${9 - i} by author${9 - i}`)
                }
            })
        })
    })

})