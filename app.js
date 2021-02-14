const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
// search form 
const imagesSearchForm = document.getElementById('images-search-form');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })

}

const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    // problem 1: bug is spelling mistake "hitS"
    // fixed bug with correct spelling "hits"
    .then(data => {
      // Extra Card Feature 
      // the property name is invalid if you give wrong input
      if (data.hits.length <= 0) {
        const card = invalidSearchCardMessage(
          "Sorry no image found on your given search name"
        );
        console.log(card);
        gallery.innerHTML = card;
        return;
      }
      showImages(data.hits);
    })
    .catch((err) => console.log(err));
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');
  // problem 5: toggler to slider images remove
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    // remove images from slider when clicked the image
    sliders.pop(img);
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  // Problem 2: bug is spelling mistake in HTML file was : "doration"
  // fixed bug "doration" to "duration"
  let duration = document.getElementById('duration').value || 1000;

  // problem 3: Negative duration time fixed
  // fixed with Negative value in slider duration
  if (duration <= 0) {
    // if input duration is Negative
    // then slider duration will be default as 1second 
    duration = 1000;
  }
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

// problem 4: add keyboard Enter to search feature
const eventMethod = (event) => {
  event.preventDefault();

  const loader = enableLoader();
  console.log(loader);
  gallery.appendChild(loader);
  // loader css
  loader.style.alignContent = "center";

  // Enable Loader
  setTimeout(function () {
    document.querySelector(".main").style.display = "none";
    clearInterval(timer);
    const search = document.getElementById("search");
    getImages(search.value);
    sliders.length = 0;
  }, 1200);
};

// Keyboard Enter method
searchBtn.addEventListener("click", eventMethod, false);
imagesSearchForm.addEventListener("submit", eventMethod, false);


sliderBtn.addEventListener('click', function () {
  createSlider()
})


// Helper function for create card message
// Extra feature for create a message in a card
// if your search input dose not match then card message show a text
const invalidSearchCardMessage = (message) => {
  return `
      <div class="card">
          <div class="card-body text-center">
              <h2>${message}</h2>
          </div>
      </div>
  `;
};

// extra feature loading function
const enableLoader = () => {
  gallery.innerHTML = "";
  galleryHeader.style.display = "none";

  var loader = document.createElement("IMG");
  loader.setAttribute("src", "loader.gif");
  loader.setAttribute("alt", "Loader");
  // loader image style
  loader.style.width = "100px";
  loader.style.height = "100px";
  loader.style.alignItems = "center";
  
  return loader;
};