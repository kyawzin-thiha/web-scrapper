"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const getEvents = async (city: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scraper/scrape?city=${city}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    cache: "no-cache"
  })

  if(response.ok) {
    return await response.json()
  } else {
    return []
  }
}
export default function Home() {

  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(false)
  const [city, setCity] = useState('')
  const [events, setEvents] = useState<Event[]>([])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(() => e.target.value);
  }
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(() => true);
    e.preventDefault();
    const response = await getEvents(city);
    setEvents(() => response);
    setLoading(() => false);
  }

  useEffect(() =>  {
    const city = searchParams.get('city')

    const fetchEvents = async () => {
      setLoading(() => true);
      const response = await getEvents(city || '');
      setEvents(() => response);
      setLoading(() => false);
    };

    if(city) {
      setCity(() => city)
      fetchEvents()
    }
  }, [])

  return (
    <div className='container'>
      <div className='input-section'>
        <input type="text" placeholder="Enter something..." className='input-section__input' value={city} onChange={onChange} />
        <button onClick={handleSubmit} className='input-section__button'>Submit</button>
      </div>

      <div className='event-grid'>
        {loading ? <p>Loading...</p> : events.map(event => <EventCard key={event.link} {...event} />)}
      </div>
    </div>
  );
}

const EventCard = ({ title, image, date, price, link } : Event) => {
  return (
    <div className="event-card">
      <img src={image} alt={title} className='event-card__image' />
      <div className='event-card__info'>
        <h3>{title}</h3>
        <p>{date}</p>
        <p>{price}</p>
        <a href={link} className='event-card__check-more-button'>Check More</a>
      </div>
    </div>
  );
};

type Event = {
  title: string;
  image: string;
  date: string;
  price: string;
  link: string;
}