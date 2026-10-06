import { useEffect, useState } from 'react'

function TestimonialsCarousel({ testimonials }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <div className="testimonial-carousel">
      <div className="testimonial-track" style={{ transform: `translateX(-${active * 100}%)` }}>
        {testimonials.map((item) => (
          <article className="testimonial-card" key={item.name}>
            <span className="testimonial-quote-mark" aria-hidden="true">“</span>
            <div className="testimonial-stars" aria-hidden="true">★★★★★</div>
            <p>{item.quote}</p>
            <div className="testimonial-person">
              <span className="testimonial-avatar">{item.name.charAt(0)}</span>
              <div>
                <strong>{item.name}</strong>
                <small>{item.role}</small>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="testimonial-dots" role="tablist" aria-label="Testimonials">
        {testimonials.map((item, index) => (
          <button
            key={item.name}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-label={`Show testimonial from ${item.name}`}
            className={`testimonial-dot ${active === index ? 'active' : ''}`}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default TestimonialsCarousel
