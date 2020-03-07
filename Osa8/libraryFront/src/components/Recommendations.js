import React from 'react'

const Recommendations = (props) => {
    if (!props.show) {
        return null
    }

    return (
        <div>
            <h2>recommendations</h2>
            <div>books in your favorite genre <b>patterns</b></div>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>
                            author
            </th>
                        <th>
                            published
            </th>
                    </tr>
                    {props.books.map(a =>
                        <tr key={a.title}>
                            <td>{a.title}</td>
                            <td>{a.author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Recommendations