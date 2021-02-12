const APP ={
  reviews: [],            
  KEY:'lee00777-Reviewr', 
  imgPath: null,          
  title:null,             
  removeTarget:null,
  ratingStar:null,
  init: function() {
    STORAGE.getData();
    APP.addListeners();
  },
  addListeners: function() {
    document.querySelector(".btnAdd").addEventListener("click", PICTURES.takePicture);
    document.getElementById("btnDetailsBack").addEventListener("click", APP.nav);
    document.querySelector('#btnDelete').addEventListener('click',STORAGE.deleteData);
    document.querySelector('#btnDelete').addEventListener('click',APP.nav);
    document.getElementById("btnSave").addEventListener("click", STORAGE.saveData);
    document.getElementById("btnSave").addEventListener("click", APP.nav);
    document.getElementById("btnAddBack").addEventListener("click", APP.nav);
  },
  nav: function (ev) { 
    let btn = ev.currentTarget;                          
    let target = btn.getAttribute("data-target"); 
    document.querySelector(".page.active").classList.remove("active");
    document.getElementById(target).classList.add("active");
  }
};
const STORAGE ={
  getData : function () {
    let storage = localStorage.getItem(APP.KEY);  
    let div= document.querySelector('.content');
    div.innerHTML='';
    let home_content=document.querySelector('h2');
    if (!storage) {
      home_content.innerHTML = "There is no review. <br> Please click BUTTON to start."
      home_content.classList.add('active');
    }else {
      home_content.classList.remove('active');   
      home_content.innerText = '';
      let df= document.createDocumentFragment();
      APP.reviews = JSON.parse(storage);  
      for (let i =0; i <APP.reviews.length; i++){
        let titleBtn = document.createElement('p');
        titleBtn.setAttribute('class','titleBtn');
        titleBtn.setAttribute('title', APP.reviews[i].title);
        titleBtn.setAttribute('data-target','reviews');
        titleBtn.setAttribute('imgPath',APP.reviews[i].img);
        titleBtn.setAttribute('id',APP.reviews[i].id);
        titleBtn.setAttribute('rating',APP.reviews[i].rating);   
        titleBtn.innerText = APP.reviews[i].title;
        APP.remove=APP.reviews[i].title; 
        let home_date=document.createElement('p');
        home_date.setAttribute('class','home_date');
        let convertedDate = new Date(APP.reviews[i].id);
        home_date.innerText = convertedDate.toLocaleDateString();
        let home_img = document.createElement('img');
        home_img.src = APP.reviews[i].img;
        let img_parent =document.createElement('div');
        img_parent.setAttribute('class','img_parent');
        img_parent.append(home_img);
        let wrapper = document.createElement('div');
        wrapper.setAttribute('class','review-card-wrapper');
        let review_card= document.createElement('div');
        review_card.setAttribute('class','review_card');
        wrapper.append(home_date);
        wrapper.append(titleBtn);
        review_card.append(img_parent);
        review_card.append(wrapper);
        df.append(review_card);
        titleBtn.addEventListener('click', function(){
          document.querySelector('#home').classList.remove('active');
          document.querySelector('#reviews').classList.add('active');
        });
        titleBtn.addEventListener('click', PAGES.showReview);
        };
        div.append(df);
      }
  },
  saveData : function(){
    let customizedTitle=document.querySelector('#title');
    APP.title=customizedTitle.value.trim();
    let val={
      id:Date.now(),
      title:APP.title,
      img:APP.imgPath,
      rating: APP.ratingStar
    };
    APP.reviews.push(val); 
    localStorage.setItem(APP.KEY,JSON.stringify(APP.reviews));
    let form=document.querySelector('form');
    form.reset();
    STORAGE.getData();
  },
  deleteData : function (ev) {
    let target = APP.removeTarget;
    APP.reviews.splice(target,1);
    let updated = JSON.stringify(APP.reviews);
    localStorage.setItem(APP.KEY, updated);
    APP.reviews = JSON.parse(updated); 
    if(APP.reviews.length === 0){
      localStorage.removeItem(APP.KEY);
    }
    STORAGE.getData();
  }
};
const PAGES ={
  showReview: function (ev){
    let figCap=document.querySelector('#review_title');
    figCap.innerText=ev.currentTarget.title;
    let review_img=document.querySelector('#review_img');
    review_img.src=ev.currentTarget.getAttribute('imgPath'); 
    let review_date = document.querySelector('#review_date');
    let convertedDate = new Date(parseInt(ev.currentTarget.getAttribute('id')));
    review_date.innerText =convertedDate.toLocaleDateString();
    let stars = document.querySelectorAll('.review_star');
    let rating = parseInt(ev.currentTarget.getAttribute('rating'))
    let ratingNum = rating -1;
    let match = false;
    stars.forEach((star,index) => {
      if(match){
        star.classList.remove('rated');
      }else{
        star.classList.add('rated');
      }
      if(index === ratingNum){
        match = true;
      }
    });
  },
  makeReview :function(){
    document.querySelector("#takePic").classList.add('active');
    let addedImg = document.querySelector('#imgAdd');
    addedImg.src = APP.imgPath;
    let stars = document.querySelectorAll('.star');
    stars.forEach(function (star){
      star.addEventListener('click', PAGES.ratingStars);
    });
    let rating = parseInt(document.querySelector('.stars').getAttribute('data-ratings'));
    let target =stars[rating -1]; 
    target.dispatchEvent(new MouseEvent('click')); 
  },
  ratingStars : function (ev){
    let tg = ev.currentTarget;
    let stars = document.querySelectorAll('.star');
    let counter = 0;
    let finding = false;
    stars.forEach((star, i) => {
      if(finding){
        star.classList.remove('rated');
      }else{
        star.classList.add('rated')
      }
      if(star === tg) {
        finding = true;
        counter = i + 1;
      }
    });
    document.querySelector('.stars').setAttribute('data-rating', counter);
    APP.ratingStar = counter;
  }
}
const PICTURES ={
  takePicture: function() {
    let options = {
      quality: 80,
      destinationType: Camera.DestinationType.FILE_URI, 
      sourceType: Camera.PictureSourceType.CAMERA,   
      mediaType: Camera.MediaType.PICTURE,
      encodingType: Camera.EncodingType.JPEG,
      cameraDirection: Camera.Direction.BACK,
      targetWidth: 300,
      targetHeight: 400
    };
    navigator.camera.getPicture(PICTURES.success, PICTURES.failure, options);
  },
  success: function (imgURI) {
    document.querySelector(".page.active").classList.remove("active");
    document.getElementById('takePic').classList.add("active");

    APP.imgPath=imgURI;
    PAGES.makeReview();
  },
  failure: function (msg){
    console.log(msg);
  }
};
  const ready = "cordova" in window ? "deviceready" : "DOMContentLoaded";
  document.addEventListener(ready, APP.init);