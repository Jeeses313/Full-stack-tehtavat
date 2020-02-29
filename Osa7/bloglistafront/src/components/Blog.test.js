import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {


    let component
    let likeBlog

    beforeEach(() => {
        const blog = {
            author: 'testAuthor',
            title: 'testTitle',
            url: 'testUrl',
            likes: 13,
            user: {
                id: 'testUserId',
                username: 'testUsername'
            }
        }

        const user = {
            id: 'testUserId',
            username: 'testUsername'
        }

        likeBlog = jest.fn()
        const removeBlog = jest.fn()

        component = render(
            <Blog blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} user={user}></Blog>
        )
    })

    test('renders title and author but not url and likes', () => {
        const titeleAndAuthor = component.getByText('testTitle by testAuthor')
        const url = component.getByText('testUrl').parentNode
        const likes = component.getByText('likes 13').parentNode

        expect(titeleAndAuthor).toBeDefined()
        expect(url).toHaveStyle('display: none')
        expect(likes).toHaveStyle('display: none')
    })

    test('renders url and likes after view button has been pressed', () => {
        const url = component.getByText('testUrl').parentNode
        const likes = component.getByText('likes 13').parentNode
        expect(url).toHaveStyle('display: none')
        expect(likes).toHaveStyle('display: none')

        const button = component.getByText('view')
        fireEvent.click(button)

        expect(url).not.toHaveStyle('display: none')
        expect(likes).not.toHaveStyle('display: none')
    })

    test('pressing like button twice calls like function twice', () => {
        const button = component.getByText('like')
        fireEvent.click(button)
        fireEvent.click(button)

        expect(likeBlog.mock.calls.length).toBe(2)
    })
})
