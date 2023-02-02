const form = document.querySelector(".top-banner form");
const input = document.querySelector("input")
const msg = document.querySelector(".msg")
const list = document.querySelector(".ajax-section .cities");

const apiKey = "5eacf3541f29b972f6bf1708e2f416a7";

const locationWeather = () => {
    const successCallback = (position) => {
       let latitude = position.coords.latitude
       let longitude = position.coords.longitude

       

       const urlLocation = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`

       fetch(urlLocation)
        .then(response => response.json())
        .then(data => {

            console.log(data);
            
            
            const { main, name, sys, weather } = data;
            const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
            weather[0]["icon"]
            }.svg`;

            const li = document.createElement("li");
            li.classList.add("city", "start");
            const markup = ` 
            <button class="closeStart"> <i class="fa-solid fa-xmark"></i> </button>
            <h2 class="city-name" data-name="${name},${sys.country}"> 
            <span>${name}</span> 
            <sup>${sys.country}</sup> 
            </h2> 
            <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup> 
            </div> 
            <div>Perceived temperature: ${Math.round(main.feels_like)}°C </div>
            <figure> 
            <img class="city-icon" src=${icon} alt=${weather[0]["main"]}> 
            <figcaption>${weather[0]["description"]}</figcaption> 
            </figure> 
            `;
            li.innerHTML = markup;
            list.appendChild(li);


            const btnClose = document.querySelector(".closeStart")
            btnClose.addEventListener("click", ()=>{
                li.remove()
            })            
        })
 
    };
      
    const errorCallback = (error) => {
        console.log(error);
    };
      
    const location = navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

}

locationWeather()



form.addEventListener("submit", e => {
  e.preventDefault();
  const inputVal = input.value;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
  .then(response => response.json())
  .then(data => {

    console.log(data);
    
    const { main, name, sys, weather } = data;
    const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
    }.svg`;

    const listItems = list.querySelectorAll(".ajax-section .city");
    const listItemsArray = Array.from(listItems);
    if (listItemsArray.length > 0) {

        const filteredArray = listItemsArray.filter(el => {
        let content = "";
 
        if (inputVal.includes(",")) {

            if (inputVal.split(",")[1].length > 2) {
            inputVal = inputVal.split(",")[0];
            content = el.querySelector(".city-name span").textContent.toLowerCase();
            } else {
            content = el.querySelector(".city-name").dataset.name.toLowerCase();
            }
        } else {

        content = el.querySelector(".city-name span").textContent.toLowerCase();
    }
    return content == inputVal.toLowerCase();
    });
  

    if (filteredArray.length > 0) {
        msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
        } ...otherwise be more specific by providing the country code as well 😉`;
        form.reset();
        input.focus();
        return;
  }
}

    const li = document.createElement("li");
    li.classList.add("city", "noGeo");
    const markup = ` 
    <button class="close"> <i class="fa-solid fa-xmark"></i> </button>
    <h2 class="city-name" data-name="${name},${sys.country}"> 
    <span>${name}</span> 
    <sup>${sys.country}</sup> 
    </h2> 
    <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup> 
    </div> 
    <div>Perceived temperature: ${Math.round(main.feels_like)}°C </div>
    <figure> 
    <img class="city-icon" src=${icon} alt=${weather[0]["main"]}> 
    <figcaption>${weather[0]["description"]}</figcaption> 
    </figure> 
    `;
    li.innerHTML = markup;
    list.appendChild(li);

    let allList = document.querySelectorAll(".noGeo")

    const btnCloseAll = document.querySelectorAll(".close")
    btnCloseAll.forEach((btn, i) => {
        btn.addEventListener("click", ()=>{
            allList[i].remove()
        })
    })
  })
  .catch(() => {
    msg.textContent = "Please search for a valid city 😩";
  });

  msg.textContent = "";
  form.reset();
  input.focus();
  
});