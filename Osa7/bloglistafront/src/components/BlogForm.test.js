import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
    let createBlog
    let component
    beforeEach(() => {
        createBlog = jest.fn()
        component = render(
            <BlogForm createBlog={createBlog}></BlogForm>
        )
    })

    test('submit calls given function with right params', () => {
        const author = component.container.querySelector('#author')
        const title = component.container.querySelector('#title')
        const url = component.container.querySelector('#url')
        const form = component.container.querySelector('form')

        fireEvent.change(author, {
            target: { value: 'testAuthor' }
        })
        fireEvent.change(title, {
            target: { value: 'testTitle' }
        })

        fireEvent.change(url, {
            target: { value: 'testUrl' }
        })
        fireEvent.submit(form)

        expect(createBlog.mock.calls.length).toBe(1)
        expect(createBlog.mock.calls[0][0]).toStrictEqual({ title: 'testTitle', author: 'testAuthor', url: 'testUrl' })
    })
})