const galleryDogs = [
  {
    name: 'Meteor the Zoomie Sprinter',
    breed: 'Whippet energy',
    vibe: 'Fast feet, dramatic turns, impossible to ignore',
    image: 'https://placedog.net/720/540?id=27',
    alt: 'A sleek dog caught mid-run in a grassy field.',
  },
  {
    name: 'Juniper the Fox-Faced Scout',
    breed: 'Shiba-style confidence',
    vibe: 'Looks like it already knows the map better than you do',
    image: 'https://placedog.net/720/540?id=54',
    alt: 'A dog with alert ears and a curious expression looking into the distance.',
  },
  {
    name: 'Atlas the Mountain Fluff',
    breed: 'Big guardian energy',
    vibe: 'A walking cloud with opinions about trail etiquette',
    image: 'https://placedog.net/720/540?id=103',
    alt: 'A large fluffy dog resting outdoors with thick fur.',
  },
  {
    name: 'Poppy the Neighborhood Diplomat',
    breed: 'Golden retriever charm',
    vibe: 'Greets every stranger like an old friend at brunch',
    image: 'https://placedog.net/720/540?id=165',
    alt: 'A smiling golden-colored dog in warm sunlight.',
  },
  {
    name: 'Domino the Pattern Icon',
    breed: 'Dalmatian flair',
    vibe: 'The kind of dog that gets noticed from half a block away',
    image: 'https://placedog.net/720/540?id=219',
    alt: 'A spotted dog standing attentively with a patterned coat.',
  },
  {
    name: 'Miso the Tiny Boss',
    breed: 'Corgi attitude',
    vibe: 'Compact frame, major executive presence',
    image: 'https://placedog.net/720/540?id=311',
    alt: 'A short-legged dog with an expressive face and upright posture.',
  },
]

const galleryGrid = document.querySelector('#galleryGrid')

galleryGrid.innerHTML = galleryDogs
  .map(
    dog => `
      <article class="gallery-card">
        <img src="${dog.image}" alt="${dog.alt}" loading="lazy" />
        <div class="gallery-copy">
          <h3>${dog.name}</h3>
          <p>${dog.vibe}</p>
          <div class="tag-row">
            <span>${dog.breed}</span>
            <span>Interesting sighting</span>
          </div>
        </div>
      </article>
    `
  )
  .join('')