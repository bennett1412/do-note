import React from 'react'
import '../styles/tagbar.scss';
const Tagbar = () => {
    const tags = ["coding", "cooking", "books", "free time"];
    return (
        <section className='tagbar-container'>
            {tags.map(ele => {
                return <button className='tag-item'>{ele}</button>
            })}
        </section>
    )
}

export default Tagbar