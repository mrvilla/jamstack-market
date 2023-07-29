import Image from 'next/image'
import styles from './page.module.css'

const getData = async () => {
    const response = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.CONTENTFUL_DELIVERY_TOKEN}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            query: `
                query {
                  tripCollection {
                    __typename
                    items {
                      __typename
                      title
                      image {
                        __typename
                        title
                        url
                      }
                      destination {
                        __typename
                        lon
                        lat
                      }
                    }
                  }
                }
            `,
        })
    });

    if (!response.ok) {
        console.error(response);
        return [];
    }

    const data = await response.json();
    return data.data.tripCollection.items;
    /**
     query {
      tripCollection {
        __typename
        items {
          __typename
          title
          image {
            __typename
            title
            url
          }
          destination {
            __typename
            lon
            lat
          }
        }
      }
    }
     */
}

export default async function Home({trips}) {
    const data = await getData();

    console.log('Data:', JSON.stringify(data, null, 2));

    return (
    <main className={styles.main}>
        <h1>
          Jamstack trips collection
        </h1>
        <div>
            {data.map((item) => (
                <>
                    <h4>{item.title}</h4>
                    <Image
                        src={item.image.url}
                        alt={item.image.title}
                        width={640}
                        height={422}
                        priority
                    />
s                </>
            ))}
        </div>
    </main>
  )
}

