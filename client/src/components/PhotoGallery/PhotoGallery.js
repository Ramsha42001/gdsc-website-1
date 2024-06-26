import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import PhotoCss from "./PhotoGallery.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "../../ThemeContext";
import cube from "./images/cubeIllustation.png";
import {motion} from 'framer-motion'
import { useInView } from "react-intersection-observer";

function Photo() {
  const { theme } = useContext(ThemeContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [allImage,setAllImage]=useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [ref,inView]=useInView({
    triggerOnce: false
  })

  const slideInVariants = {
    initial: { translateY: 100, opacity: 0 }, 
    animate: { translateY: 0, opacity:1, transition: { duration: 0.7, ease: "easeOut" } }, 
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  // const fetchImages = () => {
  //   const apiEndpoint = 'https://gdscbackend.vercel.app/gallery/';

  //   fetch(apiEndpoint)
  //     .then(response =>{console.log(response);})
  //     // .then(data => {
  //     //   console.log(data);
  //     //   setAllImage(data.map(item => item.photo));
  //     //   console.log(data.map);
  //     //   setSelectedImage(data[0].photo);
  //     // })
  //     .catch(error => {
  //       console.error('Error fetching images:', error);
  //     });
  //   };


  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
      await axios.get('https://gdsc-website-1-4bos.vercel.app/gallery/')
        .then(response => {
          console.log(response.data);
          setAllImage(response.data.map(item => item.photo));
          console.log(response.data.map);
          setSelectedImage(response.data[0].photo);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

  const convertDriveURL = (url) => {
    const parts = url.split('/');
    const fileId = parts[parts.length - 2];
    console.log(`+++++++++++++++${fileId}++++++++++++++++`);
    console.log(`+++++++++++++++${url}----------`);
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  };
  
  const previousImage =async () => {
    setIsLoading(true);
    if (currentIndex === 0) {
      setCurrentIndex(allImage.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
    setSelectedImage(allImage[currentIndex]);
    setIsLoading(false);
  };

  const nextImage =async () => {
    setIsLoading(true);
    if (currentIndex === allImage.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
    setSelectedImage(allImage[currentIndex]);
    setIsLoading(false);
  };

  useEffect(() => {
    const container = document.getElementById("image-gallery-container");
    container.scrollTo({
      left: currentIndex * container.offsetWidth,
      behavior: "smooth",
    });
  }, [currentIndex]);

  const handleClick = (index) => {
    const slider = allImage[index];
    setSelectedImage(slider);
  };

  return (
    <>
      <section id="photo" className={PhotoCss.main}>
        <div className={PhotoCss.cube}>
          <img className={PhotoCss.cubeImage} src={cube} />
        </div>
        <motion.h1
          ref={ref} 
          initial={inView ? "animate" : "initial"}
   animate={inView ? "animate" : "initial"}
   variants={slideInVariants}
          className={
            theme === "dark" ? PhotoCss.darkheading : PhotoCss.heading
          }>
          Photo Gallery
        </motion.h1>
        <div className={PhotoCss.mainDiv}>
          <div className={PhotoCss.photoDiv}>
          {/* {selectedImage && (
            <img src={convertDriveURL(selectedImage)}  className={PhotoCss.photoDiv} />
          )} */}
           {isLoading ? (
              <p>Loading...</p>
            ) : (
              selectedImage && (
                <img src={convertDriveURL(selectedImage)} className={PhotoCss.photoDiv} />
              )
            )}
          </div>
          <div className={PhotoCss.mainCarousal}>
            <motion.button
            whileHover={{rotate:[-7, 7, -5, 5, -3, 3, 0],scale:1.2}}
              className={PhotoCss.carousalButton1}
              onClick={previousImage}>
              <FontAwesomeIcon
                icon={faAngleLeft}
                size="2xl"
                style={{ color: "#fff", width: "50px", height: "50px" }}
              />
            </motion.button>
            <div className={PhotoCss.scrollingDiv} id="image-gallery-container">
              <div className={PhotoCss.carousalDiv}>
                {allImage.map((img, index) => {
                  return (
                    <img
                      className={
                        selectedImage == allImage[index]
                          ? PhotoCss["clicked"]
                          : PhotoCss["notClicked"]
                      }
                      key={index}
                      src={convertDriveURL(img)}
                      width={200}
                      height={100}
                      onClick={() => handleClick(index)}
                    />
                  );
                })}
              </div>
            </div>
            <motion.button whileHover={{rotate:[-7, 7, -5, 5, -3, 3, 0],scale:1.2}} className={PhotoCss.carousalButton2} onClick={nextImage}>
              <FontAwesomeIcon
                icon={faAngleRight}
                size="2xl"
                style={{ color: "#fff", width: "50px", height: "50px" }}
              />
            </motion.button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Photo;
