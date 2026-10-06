import { Link } from 'react-router-dom'

const content = {
  about: {
    label: 'The ShopNest story',
    title: (
      <>
        Objects that
        <br />
        <em>earn their place.</em>
      </>
    ),
    copy: 'ShopNest is a considered edit of the things we use, keep, and come back to. We believe great design is quiet, useful, and made to last.',
    cards: [
      ['Curated, not crowded', 'A smaller collection makes every choice feel intentional.'],
      ['Built for real life', 'Useful details and honest materials are always in style.'],
      ['Future friendly', 'We choose partners and products with tomorrow in mind.'],
    ],
  },
  contact: {
    label: 'We are here to help',
    title: (
      <>
        Have a question?
        <br />
        <em>Let us know.</em>
      </>
    ),
    copy: 'Our small support team is ready to help with orders, product details, or finding the right object for your space.',
    cards: [
      ['Email', 'akashaalizafar@gmail.com'],
      ['Phone', '+92-3131717561'],
      ['Hours', 'Monday to Friday, 9am to 6pm'],
    ],
  },
}

function InfoPage({ type }) {
  const page = content[type]

  return (
    <main className="info-page">
      <section className="info-hero container">
        <p className="eyebrow">{page.label}</p>
        <h1>{page.title}</h1>
        <p>{page.copy}</p>
      </section>

      <section className="info-cards container">
        {page.cards.map(([title, copy], index) => (
          <article key={title}>
            <span className="info-index">0{index + 1}</span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      {type === 'contact' ? (
        <section className="contact-form-section container">
          <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
            <p className="eyebrow">Send a note</p>
            <h2>How can we help?</h2>
            <label>
              Name
              <input required placeholder="Your name" />
            </label>
            <label>
              Email
              <input required type="email" placeholder="you@example.com" />
            </label>
            <label>
              Message
              <textarea required rows="4" placeholder="Tell us what's on your mind" />
            </label>
            <button className="button button-primary" type="submit">
              Send message
              <span>↗</span>
            </button>
          </form>
        </section>
      ) : (
        <section className="info-cta container">
          <p className="eyebrow">Start exploring</p>
          <h2>
            Make room for
            <br />
            <em>better things.</em>
          </h2>
          <Link className="button button-primary" to="/products">
            Shop the collection
            <span>↗</span>
          </Link>
        </section>
      )}
    </main>
  )
}

export default InfoPage
