    // Find the status message and card grid so JavaScript can update them.
    const status = document.querySelector('#status');
    const cardContainer = document.querySelector('#card');

    try {
      // Request the English Scarlet & Violet base set from TCGdex.
      const response = await fetch('https://api.tcgdex.net/v2/en/sets/sv01');

      // fetch() can return an HTTP error response, so check whether it succeeded.
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Convert the JSON response into a JavaScript object.
      const set = await response.json();

      // Keep cards with an image URL, then take the first 12 of those cards.
      const cards = set.cards.filter(card => card.image).slice(0, 12);

      // Build one grid tile for each card returned by the API.
      for (const card of cards) {
        const tile = document.createElement('article');
        const cardLabel = `#${card.localId} ${card.name}`;

        const title = document.createElement('h2');
        title.textContent = cardLabel;

        // A button supports both mouse clicks and keyboard activation.
        // aria-pressed starts as false because the card starts face up.
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'card-flip';
        button.setAttribute('aria-label', `Flip ${cardLabel}`);
        button.setAttribute('aria-pressed', 'false');

        // Put both faces inside one element so CSS rotates them together.
        const inner = document.createElement('span');
        inner.className = 'card-flip-inner';

        const image = document.createElement('img');
        image.className = 'card-face card-front';

        // TCGdex gives a base image URL. Add /low.webp to load the image.
        image.src = `${card.image}/low.webp`;
        image.alt = '';

        // Build the back of the card with its number, name, and set name.
        const back = document.createElement('span');
        back.className = 'card-face card-back';
        back.setAttribute('aria-hidden', 'true');

        const name = document.createElement('strong');
        name.textContent = cardLabel;

        const setName = document.createElement('span');
        setName.textContent = set.name;

        back.append(name, setName);

        // Read the current state and switch it when the button is activated.
        // CSS sees the new aria-pressed value and animates the rotation.
        button.addEventListener('click', () => {
          const isFlipped = button.getAttribute('aria-pressed') === 'true';
          button.setAttribute('aria-pressed', String(!isFlipped));
        });

        // Put the pieces together and add the finished tile to the grid.
        inner.append(image, back);
        button.append(inner);
        tile.append(title, button);
        cardContainer.append(tile);
      }

      // Replace the loading message with the set name and displayed card count.
      status.textContent = `${set.name} · Showing ${cards.length} cards`;
    } catch (error) {
      // Display an error on the page if fetching or processing the data fails.
      status.textContent = `Could not load cards. ${error.message}`;
    }
