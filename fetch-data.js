// Fetch data from existing backend endpoint
class DataFetcher {
  constructor() {
    this.apiUrl = 'https://api.vdentaleg.com/api/v1/unified-data/data';
    this.domain = 'https://api.vdentaleg.com';
    this.language = 'en';
    this.data = null;
  }

  async fetchData() {
    try {      
      const response = await fetch(this.apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`خطأ في الـ API: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      this.data = data;
      
      return data;
    } catch (error) {
      console.error('❌ خطأ في جلب البيانات:', error);
      throw error;
    }
  }

  // Helper method to find content by language
  findContentByLanguage(sectionData, language = this.language) {
    if (!sectionData || !sectionData.content) return null;
    
    return sectionData.content.find(item => 
      item.language && item.language.name === language
    ) || sectionData.content[0]; // fallback to first item
  }

  // General Settings - similar to api-service.js
  getGeneralSettings() {
    if (!this.data) return null;
    
    // Structure: data.general_settings.content is an object containing:
    // - content: array of multilingual content
    // - store_email, store_phone, facebook_pixel_id, etc. (settings not in content array)
    const generalSettingsObj = this.data.data?.general_settings?.content;
    if (!generalSettingsObj) {
      return null;
    }
    
    // Get content array (multilingual content)
    const contentArray = generalSettingsObj.content;
    if (!Array.isArray(contentArray) || contentArray.length === 0) {
      return null;
    }
    
    // Get content for current language
    // Assuming language_id: 1=en, 2=ar
    const currentLangId = this.language === 'ar' ? 2 : 1;
    const languageContent = contentArray.find(c => c.language_id === currentLangId) || contentArray[0];
    
    return {
      content: languageContent,
      store_email: generalSettingsObj.store_email,
      store_phone: generalSettingsObj.store_phone,
      gtm_container_id: generalSettingsObj.gtm_container_id,
      google_analytics_id: generalSettingsObj.google_analytics_id,
      facebook_pixel_id: generalSettingsObj.facebook_pixel_id,
      snapchat_pixel_id: generalSettingsObj.snapchat_pixel_id,
      init_tiktok_id: generalSettingsObj.init_tiktok_id,
      gtm_enabled: generalSettingsObj.gtm_enabled,
      google_analytics_enabled: generalSettingsObj.google_analytics_enabled,
      facebook_pixel_enabled: generalSettingsObj.facebook_pixel_enabled,
      snapchat_pixel_enabled: generalSettingsObj.snapchat_pixel_enabled,
      init_tiktok_enabled: generalSettingsObj.init_tiktok_enabled,
      facebook_url: generalSettingsObj.facebook_url,
      instagram_url: generalSettingsObj.instagram_url,
      twitter_url: generalSettingsObj.twitter_url,
      maintenance_mode: generalSettingsObj.maintenance_mode
    };
  }

  // Section One - Hero Section
  getSectionOne() {
    if (!this.data) return null;
    return this.findContentByLanguage(this.data.data.section_one);
  }

  // Section Two - About Section
  getSectionTwo() {
    if (!this.data) return null;
    return this.findContentByLanguage(this.data.data.section_two);
  }

  // Section Three - Services Section
  getSectionThree() {
    if (!this.data) return null;
    return this.findContentByLanguage(this.data.data.section_three);
  }

  // Section Four - Why Choose Us
  getSectionFour() {
    if (!this.data) return null;
    return this.findContentByLanguage(this.data.data.section_four);
  }

  // Section Five - Doctor Profile
  getSectionFive() {
    if (!this.data) return null;
    return this.findContentByLanguage(this.data.data.section_five);
  }

  // Section Reviews
  getSectionReviews() {
    if (!this.data) return null;
    return this.findContentByLanguage(this.data.data.section_reviews);
  }

  // Section Branches
  getSectionBranches() {
    if (!this.data) return null;
    return this.findContentByLanguage(this.data.data.section_branches);
  }

  // Section Doctors
  getSectionDoctors() {
    if (!this.data) return null;
    return this.findContentByLanguage(this.data.data.section_doctors);
  }

  // Get all sections at once
  getAllSections() {
    if (!this.data) return null;
    
    return {
      generalSettings: this.getGeneralSettings(),
      sectionOne: this.getSectionOne(),
      sectionTwo: this.getSectionTwo(),
      sectionThree: this.getSectionThree(),
      sectionFour: this.getSectionFour(),
      sectionFive: this.getSectionFive(),
      sectionReviews: this.getSectionReviews(),
      sectionBranches: this.getSectionBranches(),
      sectionDoctors: this.getSectionDoctors()
    };
  }

  // إخفاء الـ splash screen
  hideSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
      console.log('🎭 جاري إخفاء الـ splash screen...');
      splashScreen.classList.add('fade-out');
      
      setTimeout(() => {
        splashScreen.style.display = 'none';
        console.log('✅ تم إخفاء الـ splash screen');
      }, 500);
    }
  }

  // الدالة الرئيسية لجلب البيانات وإخفاء الـ splash screen
  async loadDataAndHideSplash() {
    try {
      // جلب البيانات
      const data = await this.fetchData();
      
      // إخفاء الـ splash screen بعد جلب البيانات
      this.hideSplashScreen();
      
      return data;
    } catch (error) {
      console.error('❌ فشل في تحميل البيانات:', error);
      
      // إخفاء الـ splash screen حتى لو كان هناك خطأ
      this.hideSplashScreen();
      
      throw error;
    }
  }
}

// تشغيل الكود عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async function() {
  const fetcher = new DataFetcher();
  
  try {
    // جلب البيانات وإخفاء الـ splash screen
    await fetcher.loadDataAndHideSplash();
    
    console.log('🎉 تم تحميل جميع البيانات بنجاح!');
    
    // الحصول على كل section منفصل
    const generalSettings = fetcher.getGeneralSettings();
    const sectionOne = fetcher.getSectionOne();
    const sectionTwo = fetcher.getSectionTwo();
    const sectionThree = fetcher.getSectionThree();
    const sectionFour = fetcher.getSectionFour();
    const sectionFive = fetcher.getSectionFive();
    const sectionReviews = fetcher.getSectionReviews();
    const sectionBranches = fetcher.getSectionBranches();
    const sectionDoctors = fetcher.getSectionDoctors();
    
    console.log("🏠 Section Branches:", generalSettings);
    
    // تحديث الـ hero section بالبيانات
    updateHeroSection(sectionOne, generalSettings);
    
    // تحديث الـ about section بالبيانات
    updateAboutSection(sectionTwo);
    
    // تحديث الـ services section بالبيانات
    updateServicesSection(sectionThree);
    
    // تحديث الـ why choose section بالبيانات
    updateWhyChooseSection(sectionFour);
    
    // تحديث الـ doctor section بالبيانات
    updateDoctorSection(sectionFive);
    
    // تحديث الـ reviews section بالبيانات
    updateReviewsSection(sectionReviews, sectionOne);
    
    // تحديث الـ doctors section بالبيانات
    updateDoctorsSection(sectionDoctors);
    
    // تحديث الـ branches section بالبيانات
    updateBranchesSection(sectionBranches);
    
    // تحديث الـ general settings
    updateGeneralSettings(generalSettings);
  
  } catch (error) {
    console.error('💥 خطأ في التنفيذ الرئيسي:', error);
  }
});

// دالة لتحديث الـ hero section
function updateHeroSection(sectionOne, generalSettings) {
  if (!sectionOne) {
    return;
  }

  // بناء الـ hero section من الصفر
  buildHeroSectionFromScratch(sectionOne, generalSettings);
}

// دالة لبناء الـ hero section من الصفر
function buildHeroSectionFromScratch(sectionOne, generalSettings) {
  // البحث عن الـ container
  const container = document.querySelector('.hero-banner.style-2');
  if (!container) {
    return;
  }

  // الحصول على رقم الهاتف من الـ generalSettings
  const phone = generalSettings?.store_phone || '201050800531';
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text&context=AffMX3rNCA1vEu-H-lm7x_A9zM4lbftdB9t0FPI_jQqeYxvxY8z5bMf3ICMptUcZ1UPEJVwB6hFCKdwajA9SRQ0tnbvcVtWtZHZPXn6zVchyUtJkzKDQ7Y6_OAdolwevONVHydwkGheqlH92hYSgkwg2wQ&source&app=facebook`;

  // مسح المحتوى الموجود
  container.innerHTML = '';

  // بناء الـ hero section من الصفر بنفس الـ style
  container.innerHTML = `
    <div class="container">
      <div class="inner-wrapper">
        <div class="row align-items-center h-100">
          <div class="col-lg-6">
            <div class="hero-content">
              <h1 class="title wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="0.8s">
                ${sectionOne.main_headline || 'We give a vibe to every Smile Quickly'}
              </h1>
              <div class="content-bx style-2 m-b40 primary wow fadeInUp" data-wow-delay="0.4s" data-wow-duration="0.8s">
                ${sectionOne.sub_headline || 'Your Dental health is our main concern'}
              </div>
              <div class="d-flex align-items-center m-b15 wow fadeInUp" data-wow-delay="0.6s" data-wow-duration="0.8s">
                <div class="info-widget style-12 m-r40 shadow-sm">
                  <div class="avatar-group">
                    ${sectionOne.talk_doctors_images && Array.isArray(sectionOne.talk_doctors_images) ? sectionOne.talk_doctors_images.map((doctor, index) => `
                      <img class="avatar rounded-circle avatar-md border border-white" src="https://api.vdentaleg.com/${doctor}" alt="v-Dental Clinic" style="margin-left: ${index > 0 ? '-8px' : '0'}; z-index: ${sectionOne.talk_doctors_images.length - index};" />
                    `).join('') : ''}
                  </div>
                  <div class="clearfix">
                    <span>Talk to over <strong>${sectionOne.doctor_count_text || '215'}</strong> doctor</span>
                  </div>
                </div>
                <a href="${whatsappUrl}" target="_blank" class="btn btn-square btn-xl btn-white shadow-sm btn-rounded">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7" stroke="var(--bs-primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M7 7H17V17" stroke="var(--bs-primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div class="col-lg-6 wow fadeInRight" data-wow-delay="0.8s" data-wow-duration="0.8s">
            <div class="hero-thumbnail" data-bottom-top="transform: translateY(-50px)" data-top-bottom="transform: translateY(50px)">
              <img class="thumbnail" src="https://api.vdentaleg.com/${sectionOne.main_clinic_image}" alt="v-Dental Clinic" />
              <div class="circle-wrapper"></div>
              <div class="item3" data-bottom-top="transform: translateY(-50px)" data-top-bottom="transform: translateY(50px)">
                <img class="move-3" src="images/hero-banner/img3.webp" alt="v-Dental Clinic" />
              </div>
              ${sectionOne.additional_clinic_images && Array.isArray(sectionOne.additional_clinic_images) ? sectionOne.additional_clinic_images.map((image, index) => `
                <div class="item${index + 4}" data-bottom-top="transform: translateY(-50px)" data-top-bottom="transform: translateY(50px)">
                  <img class="move-4" src="https://api.vdentaleg.com/${image}" alt="v-Dental Clinic" />
                </div>
              `).join('') : ''}
              <div class="item6" data-bottom-top="transform: translateY(-50px)" data-top-bottom="transform: translateY(50px)">
                <div class="info-widget style-13 move-4">
                  <div class="m-b15">
                    <h5 class="fw-medium m-b0">Available Doctors</h5>
                    <span class="font-13">Select Doctor</span>
                  </div>
                  ${sectionOne.available_doctors_images && Array.isArray(sectionOne.available_doctors_images) && sectionOne.available_doctors_images[0] ? `
                    <div class="d-flex align-items-center m-b15">
                      <img class="rounded-circle avatar-md" src="https://api.vdentaleg.com/${sectionOne.available_doctors_images[0].image}" alt="${sectionOne.available_doctors_images[0].name}" />
                      <div class="clearfix m-l10">
                        <h6 class="name">${sectionOne.available_doctors_images[0].name}</h6>
                        <span class="position">${sectionOne.available_doctors_images[0].short_description}</span>
                      </div>
                      <input class="form-check-input form-check1 ms-auto form-check-secondary" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                    </div>
                  ` : ''}
                  <a href="https://api.whatsapp.com/send?phone=201050800531&text&context=AffMX3rNCA1vEu-H-lm7x_A9zM4lbftdB9t0FPI_jQqeYxvxY8z5bMf3ICMptUcZ1UPEJVwB6hFCKdwajA9SRQ0tnbvcVtWtZHZPXn6zVchyUtJkzKDQ7Y6_OAdolwevONVHydwkGheqlH92hYSgkwg2wQ&source&app=facebook" class="btn btn-secondary btn-hover1 w-100 m-t10">
                    Book appointment
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <svg class="banner-shape" viewBox="0 0 1920 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1921 164.375C1734.2 -139.225 527.167 48.8754 -33 180.875H1921V164.375Z" fill="var(--bs-primary)"></path>
      <path d="M1921 164.375C1714.2 -59.2247 527.167 58.8754 -33 180.875H1921V164.375Z" fill="white"></path>
    </svg>
    <div class="banner-shape4"></div>
    <div class="banner-shape5"></div>
    <div class="banner-shape6"></div>
  `;
}

// دالة لتحديث الـ about section
function updateAboutSection(sectionTwo) {
  if (!sectionTwo) {
    return;
  }

  // بناء الـ about section من الصفر
  buildAboutSectionFromScratch(sectionTwo);
}

// دالة لبناء الـ about section من الصفر
function buildAboutSectionFromScratch(sectionTwo) {
  // البحث عن الـ container
  const container = document.querySelector('.content-inner.overlay-primary-gradient-light');
  if (!container) {
    return;
  }

  // مسح المحتوى الموجود
  container.innerHTML = '';

  // بناء الـ about section من الصفر بنفس الـ style
  container.innerHTML = `
    <div class="container">
      <div class="row content-wrapper style-11 m-b30 justify-content-center">
        <div class="col-xxl-4 col-xl-5 col-lg-5 col-md-7">
          <div class="content-media m-b30">
            <div class="dz-media" data-bottom-top="transform: translateY(30px)" data-top-bottom="transform: translateY(0px)">
              <img src="https://api.vdentaleg.com/${sectionTwo.main_clinic_image}" alt="V-Dental Clinic" />
            </div>
            <div class="item1" data-bottom-top="transform: translateY(-50px)" data-top-bottom="transform: translateY(0px)"></div>
            <div class="item2" data-bottom-top="transform: translateY(-30px)" data-top-bottom="transform: translateY(0px)">
            </div>
            <div class="item3" data-bottom-top="transform: translateY(-50px)" data-top-bottom="transform: translateY(0px)">
              <svg viewBox="0 0 496 175" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_i_3_4351)">
                  <path d="M455.54 4C647.742 4 2.913 252.086 4.727 142.129c.25-15.123 16.243-24.141 31.273-25.835V116.294" stroke="var(--bs-primary)" stroke-width="8" />
                </g>
                <defs>
                  <filter id="filter0_i_3_4351" x=".723" y="0" width="494.598" height="177.24" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="1.5" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.833 0 0 0 0 0.896 0 0 0 1 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3_4351" />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
        <div class="col-xxl-6 col-xl-7 col-lg-7">
          <div class="content-info pt-md-5 m-b30">
            <div class="section-head style-3 m-b30 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="0.8s">
              <h2 class="title">${sectionTwo.main_headline || 'We Care About Your Dental Health'}</h2>
              <p>${sectionTwo.description || 'We are dedicated to nurturing your oral well-being with unwavering commitment, cutting-edge expertise, and a gentle touch that makes every visit a positive experience.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// دالة لتحديث الـ services section
function updateServicesSection(sectionThree) {
  if (!sectionThree) {
    return;
  }

  // تحديث العنوان الرئيسي
  const title = document.querySelector('.overlay-primary-light .title');
  if (title && sectionThree.main_headline) {
    title.textContent = sectionThree.main_headline;
  }

  // تحديث الوصف
  const description = document.querySelector('.overlay-primary-light .m-b0, .overlay-primary-light p');
  if (description && sectionThree.description) {
    description.textContent = sectionThree.description;
  }

  // تحديث صور الخدمات (services_images array)
  const dzMediaElements = document.querySelectorAll('.overlay-primary-light .row .dz-media');
  if (dzMediaElements.length > 0 && sectionThree.services_images && Array.isArray(sectionThree.services_images)) {
    dzMediaElements.forEach((mediaElement, index) => {
      if (sectionThree.services_images[index]) {
        const img = mediaElement.querySelector('img');
        if (img) {
          img.src = `https://api.vdentaleg.com/${sectionThree.services_images[index]}`;
          img.alt = `Service Image ${index + 1}`;
        }
      }
    });
  }

  // تحديث صور before and after
  const twentytwentyContainer = document.querySelector('.twentytwenty-container');
  if (twentytwentyContainer) {
    // تحديث صورة before (الصورة الأولى)
    const beforeImg = twentytwentyContainer.querySelector('img:first-child');
    if (beforeImg && sectionThree.service_image_before) {
      beforeImg.src = `https://api.vdentaleg.com/${sectionThree.service_image_before}`;
      beforeImg.alt = 'Before';
    }

    // تحديث صورة after (الصورة الثانية)
    const afterImg = twentytwentyContainer.querySelector('img:last-child');
    if (afterImg && sectionThree.service_image_after) {
      afterImg.src = `https://api.vdentaleg.com/${sectionThree.service_image_after}`;
      afterImg.alt = 'After';
    }
  }
}

// دالة لتحديث الـ why choose section
function updateWhyChooseSection(sectionFour) {
  if (!sectionFour) {
    return;
  }

  // بناء الـ why choose section من الصفر
  buildWhyChooseSectionFromScratch(sectionFour);
}

// دالة لبناء الـ why choose section من الصفر
function buildWhyChooseSectionFromScratch(sectionFour) {
  // البحث عن الـ container
  const container = document.querySelector('.twentytwenty-top-spacing');
  if (!container) {
    return;
  }

  // مسح المحتوى الموجود
  container.innerHTML = '';

  // بناء الـ section من الصفر بنفس الـ style
  container.innerHTML = `
    <div class="container">
      <div class="row content-wrapper style-10 align-items-center">
        <div class="col-lg-6 m-b30">
          <div class="section-head style-1 m-b30 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="0.8s">
            <h2 class="title">${sectionFour.main_headline || 'Why Choose Us'}</h2>
            <p>${sectionFour.main_description || 'Choose us for excellence and quality'}</p>
          </div>
          <div class="accordion dz-accordion style-2" id="accordionExample">
            ${sectionFour.features && Array.isArray(sectionFour.features) ? sectionFour.features.map((feature, index) => `
              <div class="accordion-item wow fadeInUp" data-wow-delay="${0.4 + (index * 0.2)}s" data-wow-duration="0.8s">
                <h2 class="accordion-header">
                  <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index === 0 ? 'One' : index === 1 ? 'Two' : 'Three'}" aria-expanded="${index === 0 ? 'true' : 'false'}" aria-controls="collapse${index === 0 ? 'One' : index === 1 ? 'Two' : 'Three'}">
                    ${feature.title}
                  </button>
                </h2>
                <div id="collapse${index === 0 ? 'One' : index === 1 ? 'Two' : 'Three'}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    <div class="row align-items-center g-3">
                      <div class="col-sm-8">
                        <h3 class="title">${feature.title}</h3>
                        <p>${feature.description}</p>
                      </div>
                      <div class="col-sm-4">
                        <div class="dz-media radius-md">
                          <img src="https://api.vdentaleg.com/${feature.image}" alt="${feature.title}" width="200px" height="200px" style="object-fit: contain; width: 200px; height: 200px;" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `).join('') : ''}
          </div>
        </div>
        <div class="col-lg-6 m-b30 text-center text-lg-start wow fadeInUp" data-wow-delay="1.0s" data-wow-duration="0.8s">
          <div class="content-media" data-bottom-top="transform: translateY(-50px)" data-top-bottom="transform: translateY(50px)">
            <div class="media-top">
              <div class="media1">
                <img src="https://api.vdentaleg.com/${sectionFour.right_section_image_2}" alt="Feature 2" />
              </div>
              <div class="media2">
                <img src="https://api.vdentaleg.com/${sectionFour.right_section_image_1}" alt="Feature 1" />
              </div>
            </div>
            <div class="media-bottom">
              <div class="media3">
                <img src="https://api.vdentaleg.com/${sectionFour.right_section_image_3}" alt="Feature 3" />
              </div>
              <div class="media4">
                <img src="https://api.vdentaleg.com/${sectionFour.right_section_image_4}" alt="Feature 4" />
              </div>
            </div>
            <div class="item1 move-3">
              <img src="images/hero-banner/img4.webp" alt="v-Dental Clinic" />
            </div>
            <div class="circle-wrapper">
              <img src="images/bg-circle.svg" alt="v-Dental Clinic" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// دالة لتحديث الـ doctor section
function updateDoctorSection(sectionFive) {
  if (!sectionFive) {
    return;
  }

  // بناء الـ doctor section من الصفر
  buildDoctorSectionFromScratch(sectionFive);
}

// دالة لبناء الـ doctor section من الصفر
function buildDoctorSectionFromScratch(sectionFive) {
  // البحث عن الـ container
  const container = document.querySelector('.content-inner.p-t50.bg-light');
  if (!container) {
    return;
  }

  // مسح المحتوى الموجود
  container.innerHTML = '';

  // بناء الـ doctor section من الصفر بنفس الـ style
  container.innerHTML = `
    <div class="container">
      <div class="row content-wrapper style-9 align-items-end">
        <div class="col-xl-6 col-lg-6 m-b30">
          <div class="section-head style-2 m-b30">
            <div class="sub-title wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="0.8s">
              Best Dentist
            </div>
          </div>
          <h3 class="text-primary title-dashed-separator wow fadeInUp" data-wow-delay="0.8s" data-wow-duration="0.8s">
            About Services
          </h3>
          <ul class="list-check text-secondary fw-medium grid-2 m-b35 wow fadeInUp" data-wow-delay="1.0s" data-wow-duration="0.8s">
            ${sectionFive.about_services && Array.isArray(sectionFive.about_services) ? sectionFive.about_services.map(service => `
              <li><i class="fa fa-check"></i> ${service}</li>
            `).join('') : ''}
          </ul>
          <div class="row align-items-center g-4">
            <div class="col-sm-6 d-flex wow fadeInUp" data-wow-delay="1.2s" data-wow-duration="0.8s">
            </div>
            <div class="col-sm-6 wow fadeInUp" data-wow-delay="1.4s" data-wow-duration="0.8s">
              <a href="https://api.whatsapp.com/send?phone=201050800531&text&context=AffMX3rNCA1vEu-H-lm7x_A9zM4lbftdB9t0FPI_jQqeYxvxY8z5bMf3ICMptUcZ1UPEJVwB6hFCKdwajA9SRQ0tnbvcVtWtZHZPXn6zVchyUtJkzKDQ7Y6_OAdolwevONVHydwkGheqlH92hYSgkwg2wQ&source&app=facebookl" class="btn btn-lg btn-icon btn-primary">
                Appointment
                <span class="right-icon"><i class="feather icon-arrow-right"></i></span>
              </a>
            </div>
          </div>
        </div>
        <div class="col-xl-6 col-lg-6 m-b30">
          <div class="content-media">
            <div class="dz-media" data-bottom-top="transform: translateY(30px)" data-top-bottom="transform: translateY(-30px)">
              <img src="https://api.vdentaleg.com/${sectionFive.doctor_image}" alt="Doctor Image" />
            </div>
            <div class="item1" data-bottom-top="transform: translateY(-20px)" data-top-bottom="transform: translateY(10px)">
              <div class="info-widget style-10 move-3">
                <span class="content-text text-primary">
                  <span class="counter">${sectionFive.experience_years || '20'}</span>+
                </span>
                <h3 class="title m-b0">
                  Years <br />
                  Experienced
                </h3>
              </div>
            </div>
            <div class="item2" data-bottom-top="transform: translateY(-20px)" data-top-bottom="transform: translateY(10px)">
              <div class="dz-img-box style-1 move-4">
                <div class="dz-media">
                  <svg width="150px" height="150px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 363.6 137.5" style="enable-background:new 0 0 363.6 137.5;" xml:space="preserve">
                    <g>
                      <path fill="#5D734C" d="M114.5,121.4"></path>
                      <g>
                        <path fill="#5E734D" d="M112.9,29.7"></path>
                        <g>
                          <path fill="#C8A444" d="M127.3,13.2l-0.8,0.1c-0.1,0-4.3,0.8-6.3,5l-0.3,0.7l0,0c-0.7,1.3-1.4,2.6-2,3.9c-0.5,1-1.1,2-1.7,3     c-0.1,0.1-0.1,0.3-0.2,0.4c-0.4,0.7-0.8,1.5-1.2,2.2c-1.3,2.4-2.6,4.8-3.8,7.1c0,0,0,0,0,0.1l-0.8,1.6c-0.1,0.3-0.3,0.5-0.4,0.8     c-0.1,0.3-0.3,0.6-0.5,0.9c-0.5,0.9-1,1.8-1.5,2.8c-0.2,0.3-0.3,0.6-0.5,0.9c0,0.1-0.1,0.2-0.1,0.2c-0.3,0.5-0.6,1-0.8,1.5     c-0.1,0.2-0.3,0.5-0.4,0.7c-0.6,1.1-1.2,2.2-1.8,3.3c-0.2,0.3-0.4,0.7-0.5,1c-0.6,1.2-1.2,2.3-1.8,3.5c-0.5,0.9-0.9,1.8-1.4,2.7     c-0.1,0.2-0.2,0.5-0.4,0.7c-0.2,0.5-0.5,0.9-0.7,1.4L99,57.9c-0.9,1.6-1.7,3.2-2.6,4.8c-1.1,2-2.2,4.1-3.3,6.2l-8.3,15.5l0,0     c-0.6,1.1-1.1,2.1-1.6,2.9c-0.6,1-1.1,2.1-1.7,3.1l-5.3,9.8v0l0,0l-1.8,3.4l-0.1,0.1v0l-4.1,7.7l-0.4,0.7l-0.3-0.5l-0.5-1     l-0.9-1.6c0-0.1-0.1-0.2-0.1-0.2c0,0,0,0,0-0.1c-0.3-0.6-0.6-1.2-0.9-1.8c-0.5-1-1-2-1.5-2.9c-0.7-1.4-1.5-2.8-2.2-4.1     c-0.4-0.8-0.9-1.6-1.3-2.4c-0.3-0.6-0.7-1.2-1-1.9c-0.9-1.7-1.8-3.3-2.6-5c-0.8-1.6-1.7-3.2-2.5-4.7c-0.8-1.5-1.6-3-2.4-4.5     c-0.7-1.3-1.4-2.6-2.1-3.9c-0.3-0.5-0.6-1-0.8-1.5l-1.8-3.4c-0.3-0.6-0.7-1.3-1-1.9L47,69.3c-0.2-0.5-0.5-0.9-0.7-1.4l-0.6-1.2     c-1.2-2.2-2.4-4.5-3.6-6.7c-0.3-0.5-0.5-1-0.8-1.5l-3.3-6.2l0,0c-0.1-0.3-0.3-0.6-0.4-0.9c-0.2-0.3-0.3-0.7-0.5-1l-0.6-1.3     c0.2,0,0.4,0.1,0.5,0.1c0.6,0.1,1.2,0.2,1.8,0.3c0.9,0.2,1.8,0.4,2.7,0.7l0.1,0c1.2,0.3,2.3,0.7,3.5,1.1c0.6,0.2,1.3,0.5,1.9,0.7     c1,0.4,1.9,0.8,2.9,1.2l15.9,28l0,0c0.5,0.9,1,1.9,1.6,2.8l2.5,4.5c0.1-0.2,0.2-0.3,0.3-0.5c0.8-1.4,1.5-2.9,2.3-4.4     c1.3-2.4,2.6-4.8,3.8-7.1c0.7-1.2,1.3-2.5,2-3.7c1.1-2.1,2.3-4.2,3.4-6.3l0.2-0.3c0.9-1.6,1.7-3.2,2.6-4.8     c0.4-0.7,0.8-1.4,1.2-2.2c0.5-0.9,1-1.9,1.5-2.8c0.8-1.4,1.6-2.9,2.3-4.3c0.5-1,1-1.9,1.5-2.9l0,0l0.8-1.6l0-0.1l4.8-8.9l0.1-0.1     c0,0,0,0,0,0l0.7-1.3l0.3-0.6l0-0.1c0-0.1,0.1-0.2,0.1-0.3l0.1-0.2c0,0,0,0,0-0.1l1.8-3.4l0.1-0.2c1.7-3.1,3.4-6.3,5.1-9.4     l2.1-3.9l0-0.2l3.8-7.3h1v0l8.2,0h3.5l0,0l2.7,0l0.7-0.1L127.3,13.2z"></path>
                        </g>
                        <polygon fill="#C8A444" points="91.2,49.5 92.1,47.8 91.2,49.4   "></polygon>
                        <path fill="#C8A444" d="M96.6,38.9l-4.8,8.9l0,0.1c0,0,0,0,0,0c-4.1,1.4-8,3.2-11.8,5.3c-3.6,2-7.1,4.2-10.6,6.3    c-0.4,0.2-0.7,0.2-1,0c-1.2-0.8-2.5-1.7-3.8-2.4c-2.8-1.6-5.5-3.1-8.3-4.6c-4.3-2.3-8.7-4.1-13.4-5.5c0,0,0,0,0,0    c-2.5-0.7-5-1.3-7.5-1.4c-0.5,0-1.1-0.1-1.6-0.1c-0.8,0-1.7,0-2.6,0.2c-3.6,0.4-6.2,2.2-7.9,5.4c-1.7,3.1-1.8,6.6-2.1,10    c-0.3,4.6,0.5,9.1,1.4,13.6c0.8,3.8,1.9,7.5,3.1,11.2c0.6,2.1,1.4,4.1,2.2,6.1c0.7,1.9,1.5,3.7,2.4,5.6c0.6,1.2,1.2,2.4,1.8,3.7    c0.9,1.8,1.6,3.7,2.7,5.4c1.6,2.6,3.4,5.2,5.2,7.7c1.4,2,3.2,3.7,5.3,4.9c1.5,0.9,3.1,1.6,4.9,0.9c1-0.4,1.9-0.9,2.7-1.6    c1.6-1.2,2.8-2.8,3.8-4.5c1.3-2.2,2.6-4.2,3.9-6.4c0.7-1.1,1.3-2.3,2-3.5c0.1,0.2,0.1,0.2,0.2,0.3c1.1,2.1,2.3,4.1,3.4,6.2    c0.3,0.6,0.5,1.3,0.2,1.9c0,0,0,0,0,0v0c0,0.1-0.1,0.2-0.2,0.3c-1.1,1.6-2.1,3.3-3.2,5c-1.8,2.6-3.7,5.1-6.4,7    c-2.2,1.6-4.6,2.7-7.3,2.8c-4.2,0.2-7.6-1.7-10.6-4.3c-1.5-1.3-2.9-2.9-4.2-4.4c-1.4-1.7-2.7-3.4-3.9-5.3c-1.3-1.9-2.4-4-3.4-6    c-1.4-2.6-2.8-5.2-3.9-7.9c-1.3-2.8-2.2-5.8-3.4-8.7c-1.6-3.8-2.7-7.8-3.6-11.8c-1-4.3-1.7-8.7-2.1-13.1    c-0.4-4.7-0.5-9.5,0.9-14.1c0.7-2.4,1.6-4.8,3.1-6.9c3-4.2,7.1-6.4,12.1-7c0.2,0,0.3-0.1,0.5-0.1c0.2,0,0.3-0.1,0.6-0.1    c0,0,0,0,0,0c0.3,0,3.3,0,6.7,0.4c1,0.1,2,0.3,3,0.5c0,0,0,0,0,0c0,0,0.1,0,0.1,0c0.5,0.1,0.9,0.2,1.4,0.3    c0.5,0.1,1.1,0.3,1.6,0.4c0,0,0,0,0,0c0.1,0,0.3,0.1,0.4,0.1c1,0.3,2,0.6,2.9,0.9c3.5,1.3,6.9,2.6,10.3,4.2    c3.4,1.6,6.7,3.6,10,5.5c0.7,0.4,1.4,0.5,2.1,0c0.5-0.3,0.9-0.6,1.4-0.8c2.2-1.3,4.4-2.6,6.7-3.8c2.1-1.1,4.3-1.9,6.4-2.9    c3.5-1.6,7.2-2.7,10.9-3.7C95.7,39.1,96.1,39,96.6,38.9z"></path>
                        <g>
                          <path fill="#C8A444" d="M41.9,35.6l-0.5-0.1h-0.2c-0.6-0.1-1.1-0.2-1.7-0.3c-0.8-0.1-1.6-0.2-2.3-0.3c-0.5,0-1-0.1-1.4-0.1     c-1.1-0.1-2-0.1-2.8-0.2c-0.8,0-1.4,0-1.7,0c-0.1,0-0.2,0-0.2,0l-0.3,0h0l-0.1,0l-0.4,0.1c-0.2,0-0.3,0.1-0.5,0.1     c-0.1,0-0.2,0.1-0.3,0.1c0,0-0.1,0-0.1,0c-0.2,0-0.4,0.1-0.6,0.1c-0.8-1.5-1.6-3-2.4-4.5l-7.6-14.2c-2.1-2.2-4.7-2.7-4.8-2.8     l-0.8-0.1l0.3-1.5l0.6,0.1l0-0.1l2.3,0l0,0h4l8.2,0l0,0h0.6l3.8,7.1l0.1,0.2c0,0.1,0,0.1,0.1,0.2c0.8,1.5,1.6,3,2.4,4.5     c0.6,1.1,1.2,2.3,1.8,3.4c1.2,2.2,2.4,4.4,3.6,6.6l0.3,0.6C41.5,34.9,41.7,35.2,41.9,35.6C41.9,35.6,41.9,35.6,41.9,35.6     L41.9,35.6z"></path>
                        </g>
                        <path fill="#C8A444" d="M77,107.8c0.2,0.3,0.3,0.5,0.5,0.8c0.2,0.3,0.3,0.5,0.5,0.8c0.3,0.5,0.6,1,1,1.6c0,0.1,0.1,0.1,0.1,0.2    c0,0,0,0.1,0.1,0.1c0.6,0.9,1.2,1.9,1.8,2.8c1.3,2,2.8,3.9,4.9,5.2c1.1,0.7,2.3,1.4,3.7,1c1.2-0.4,2.5-0.9,3.5-1.6    c2.1-1.4,3.8-3.3,5.3-5.3c2.2-3,4.2-6.1,5.9-9.5c1.6-3.2,3.2-6.5,4.6-9.8c1.3-3.1,2.4-6.3,3.5-9.4c1.7-5.1,2.9-10.4,3.7-15.7    c0.5-3.5,0.6-7.1,0.2-10.6c-0.2-2.6-0.7-5.1-1.9-7.4c-1.2-2.2-2.9-3.8-5.2-4.7c0,0,0,0,0,0l3.5-6.5c0.4,0.2,0.8,0.3,1.2,0.5    c0.1,0,0.2,0.1,0.3,0.1c0,0,0,0,0,0c0.1,0,0.2,0.1,0.3,0.1c0.1,0,0.2,0.1,0.2,0.1c0,0,0,0,0,0c0.1,0,0.2,0.1,0.2,0.1    c0.1,0.1,0.2,0.1,0.3,0.2c2.2,1.5,4.1,3.2,5.3,5.7c0.7,1.5,1.5,3,2,4.6c1.5,5,1.7,10.1,1.3,15.2c-0.5,5.8-1.5,11.5-3.2,17    c-1.1,3.7-2.3,7.3-3.7,10.9c-2,5.1-4.3,10.2-7.1,15c-2.1,3.6-4.3,7.1-7,10.2c-1.4,1.6-2.9,3-4.5,4.4c-2,1.8-4.3,2.9-6.8,3.4    c-2.8,0.6-5.5,0.3-8.1-1.1c-1.5-0.8-2.9-1.8-4.1-3c-1.2-1.2-2.3-2.4-3.2-3.8c-0.3-0.4-0.6-0.8-0.9-1.3c-0.3-0.4-0.6-0.8-0.9-1.3    c-0.1-0.2-0.3-0.4-0.4-0.6c-0.3-0.4-0.6-0.9-0.8-1.3c-0.1-0.2-0.3-0.4-0.4-0.6l4-7.5C76.6,107.2,76.8,107.5,77,107.8z"></path>
                        <g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <div class="dz-content">
                  <h3 class="title">${sectionFive.title || 'V Dental Clinics 2025'}</h3>
                  <p>${sectionFive.short_description || 'Quality and Accreditation Institute'}</p>
                  <a href="javascript:void(0);" class="btn-link">Best Dermatologists</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// دالة لتحديث الـ reviews section
function updateReviewsSection(sectionReviews, sectionOne) {
  if (!sectionReviews) {
    return;
  }

  // الحصول على البيانات من الـ content array
  let reviewsData = sectionReviews.reviews;
  if (sectionReviews.content && sectionReviews.content[0]) {
    reviewsData = sectionReviews.content[0].reviews;
  }

  // تحديث الـ avatar-group والـ doctor count من sectionOne
  if (sectionOne) {
    const avatarGroup = document.querySelector('.gradient-primary .avatar-group');
    if (avatarGroup && sectionOne.talk_doctors_images && Array.isArray(sectionOne.talk_doctors_images)) {
      avatarGroup.innerHTML = '';
      sectionOne.talk_doctors_images.forEach((image, index) => {
        const img = document.createElement('img');
        img.className = 'avatar rounded-circle avatar-md border border-white';
        img.src = `https://api.vdentaleg.com/${image}`;
        img.alt = 'v-Dental Clinic';
        img.style.marginLeft = index > 0 ? '-8px' : '0';
        img.style.zIndex = `${sectionOne.talk_doctors_images.length - index}`;
        avatarGroup.appendChild(img);
      });
    }

    // تحديث عدد الأطباء من sectionOne
    const doctorCount = document.querySelector('.gradient-primary .clearfix span');
    if (doctorCount && sectionOne.doctor_count_text) {
      doctorCount.textContent = `Talk to over ${sectionOne.doctor_count_text} doctor`;
    }
  }

  // مسح الـ swiper slides الموجودة وبناءها تاني
  const swiperWrapper = document.querySelector('.gradient-primary .swiper-wrapper');
  if (swiperWrapper && reviewsData && Array.isArray(reviewsData)) {
    // مسح الـ slides الموجودة
    swiperWrapper.innerHTML = '';
    
    // بناء الـ slides الجديدة
    reviewsData.forEach((review, index) => {
      const slide = document.createElement('div');
      slide.className = `swiper-slide wow fadeInUp`;
      slide.setAttribute('data-wow-delay', `${0.6 + (index * 0.2)}s`);
      slide.setAttribute('data-wow-duration', '0.8s');
      
      slide.innerHTML = `
        <div class="testimonial-2">
          <div class="testimonial-media">
            <img src="https://api.vdentaleg.com/${review.image}" alt="Testimonial" />
          </div>
          <div class="testimonial-detail">
            <div class="testimonial-head">
              <ul class="star-list">
                ${Array(review.rating || 5).fill(0).map(() => '<li><i class="fa fa-star"></i></li>').join('')}
              </ul>
              <h3 class="title">${review.rating_text || 'Best Treatment'}</h3>
            </div>
            <div class="testimonial-contant">
              <div class="testimonial-text">
                <p>${review.review_text || ''}</p>
              </div>
            </div>
            <div class="testimonial-info">
              <div class="dz-media">
                <img src="https://api.vdentaleg.com/${review.reviewer_image}" alt="Reviewer" />
              </div>
              <div class="clearfix">
                <h5 class="testimonial-name">${review.reviewer_name || ''}</h5>
              </div>
            </div>
          </div>
        </div>
      `;
      
      swiperWrapper.appendChild(slide);
    });
  }
}

// دالة لتحديث الـ doctors section
function updateDoctorsSection(sectionDoctors) {
  if (!sectionDoctors) {
    return;
  }

  // تحديث العنوان الرئيسي
  const title = document.querySelector('.section-doctors .title');
  if (title && sectionDoctors.title) {
    title.textContent = sectionDoctors.title;
  }

  // تحديث الوصف
  const description = document.querySelector('.section-doctors .description');
  if (description && sectionDoctors.description) {
    description.textContent = sectionDoctors.description;
  }

  // بناء الـ doctors section من الصفر
  if (sectionDoctors.doctors && Array.isArray(sectionDoctors.doctors)) {
    buildDoctorsSectionFromScratch(sectionDoctors.doctors);
  }
}

// دالة لبناء الـ doctors section من الصفر
function buildDoctorsSectionFromScratch(doctors) {
  // البحث عن الـ swiper wrappers
  const smallSwiperWrapper = document.querySelector('.dz-team-swiper1-thumb .swiper-wrapper');
  const largeSwiperWrapper = document.querySelector('.dz-team-swiper1 .swiper-wrapper');
  
  if (!smallSwiperWrapper || !largeSwiperWrapper) {
    return;
  }

  // مسح الـ slides الموجودة
  smallSwiperWrapper.innerHTML = '';
  largeSwiperWrapper.innerHTML = '';

  // بناء الـ slides الجديدة
  doctors.forEach((doctor, index) => {
    // بناء الـ small slide (اليمين) - style-3
    const smallSlide = createSmallDoctorSlideStyle3(doctor, index);
    smallSwiperWrapper.appendChild(smallSlide);

    // بناء الـ large slide (الشمال) - style-4
    const largeSlide = createLargeDoctorSlideStyle4(doctor, index);
    largeSwiperWrapper.appendChild(largeSlide);
  });

  // إضافة CSS للـ mobile scaling (مرة واحدة فقط)
  if (!document.getElementById('mobile-scale-style')) {
    const style = document.createElement('style');
    style.id = 'mobile-scale-style';
    style.textContent = `
      @media (max-width: 767.98px) {
        .mobile-scale {
          transform: scale(0.8) !important;
          transform-origin: center;
        }
        .mobile-scale .list-check-try {
          font-size: 0.8rem !important;
        }
        .mobile-scale .info-widget {
          font-size: 0.85rem !important;
        }
        .mobile-scale .info-widget .widget-media img {
          max-width: 35px !important;
          max-height: 35px !important;
        }
        .mobile-scale .info-widget .title {
          font-size: 0.85rem !important;
        }
        .mobile-scale .info-widget .sub-title {
          font-size: 0.7rem !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// دالة لإنشاء الـ small doctor slide (style-3)
function createSmallDoctorSlideStyle3(doctor, index) {
  const slide = document.createElement('div');
  slide.className = 'swiper-slide';
  slide.innerHTML = `
    <div class="dz-team style-3">
      <div class="dz-body">
        <div class="dz-media">
          <img src="https://api.vdentaleg.com/${doctor.small_image}" alt="${doctor.name}" />
        </div>
        <div class="dz-content">
          <h3 class="dz-name">
            <a href="javascript:void(0);">${doctor.name}</a>
          </h3>
          <span class="dz-position">${doctor.short_description}</span>
        </div>
      </div>
      <div class="dz-footer">
        <ul class="dz-social">
          <li>
            <a class="instagram-setting" href="${doctor.instagram}" target="_blank">
              <i class="fa-brands fa-instagram"></i>
            </a>
          </li>
          <li>
            <a class="facebook-setting" href="${doctor.facebook}" target="_blank">
              <i class="fa-brands fa-facebook-f"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  `;
  return slide;
}

// دالة لإنشاء الـ large doctor slide (style-4)
function createLargeDoctorSlideStyle4(doctor, index) {
  const slide = document.createElement('div');
  slide.className = 'swiper-slide';
  slide.innerHTML = `
    <div class="dz-team style-4">
      <div class="dz-media">
        <img src="https://api.vdentaleg.com/${doctor.image_main}" alt="${doctor.name}" />
      </div>
      <ul class="dz-social">
        <li>
          <a class="instagram-setting" href="${doctor.instagram}" target="_blank">
            <i class="fa-brands fa-instagram"></i>
          </a>
        </li>
        <li>
          <a class="facebook-setting" href="${doctor.facebook}" target="_blank">
            <i class="fa-brands fa-facebook-f"></i>
          </a>
        </li>
      </ul>
      <div class="item1 d-block d-md-block mobile-scale" style="display: block !important;">
        <ul class="list-check-try fw-medium text-secondary">
          <li>Teeth Whitening</li>
          <li>Root Canal</li>
        </ul>
      </div>
      <div class="item2 d-block d-md-block mobile-scale" style="display: block !important;">
        <div class="info-widget style-3">
          <div class="widget-head">
            <div class="widget-media">
              <img src="https://api.vdentaleg.com/${doctor.small_image}" alt="${doctor.name}" />
            </div>
            <div class="widget-content">
              <h6 class="title">${doctor.name}</h6>
              <span class="sub-title text-primary">${doctor.short_description}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  return slide;
}

// دالة لتحديث الـ branches section
function updateBranchesSection(sectionBranches) {
  if (!sectionBranches) {
    return;
  }

  // بناء الـ branches section من الصفر
  buildBranchesSectionFromScratch(sectionBranches);
}

// دالة لبناء الـ branches section من الصفر
function buildBranchesSectionFromScratch(sectionBranches) {
  // البحث عن الـ container
  const container = document.querySelector('.content-inner.branches');
  if (!container) {
    return;
  }

  // مسح المحتوى الموجود
  container.innerHTML = '';

  // الحصول على بيانات الفروع
  let branchesData = sectionBranches.branches;
  if (sectionBranches.content && sectionBranches.content[0]) {
    branchesData = sectionBranches.content[0].branches;
  }

  if (!branchesData || !Array.isArray(branchesData)) {
    return;
  }

  // بناء الـ branches section من الصفر بنفس الـ style
  container.innerHTML = `
    <div class="container">
      <div class="row">
        ${branchesData.map((branch, index) => `
          <div class="col-lg-6 m-b30 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="0.8s">
            <div class="map-wrapper style-1">
              ${branch.iframe || ''}
              <div class="item1">
                <div class="info-widget style-16">
                  <div class="row g-xl-5 g-4">
                    <div class="col-xl-6 col-lg-12 col-md-6">
                      <div class="icon-bx-wraper style-1 align-items-center">
                        <div class="icon-bx bg-primary">
                          <span class="icon-cell">
                            <i class="feather icon-clock"></i>
                          </span>
                        </div>
                        <div class="icon-content branches-working-hours">
                          <h5 class="dz-title fw-semibold branches-working-hours">
                            Working Hours:
                          </h5>
                          <p>${branch.working_hours ? branch.working_hours.replace(/\n/g, '<br />') : 'sat-thu: 3:00pm-10:00pm<br />fri: no working'}</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-xl-6 col-lg-12 col-md-6">
                      <div class="icon-bx-wraper style-1 align-items-center">
                        <div class="icon-bx bg-secondary">
                          <span class="icon-cell">
                            <i class="feather icon-map-pin"></i>
                          </span>
                        </div>
                        <div class="icon-content">
                          <h5 class="dz-title fw-semibold">
                            Office Address:
                          </h5>
                          <p>${branch.address ? branch.address.replace(/\n/g, '<br />') : 'clinic 121, Abdullah ibn salamah, the fount mall, قسم أول القاهرة الجديدة، محافظة القاهرة 11865'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// دالة لتحديث الـ general settings
function updateGeneralSettings(generalSettings) {
  if (!generalSettings || !generalSettings.content) {
    return;
  }

  // Check maintenance mode
  if (generalSettings.maintenance_mode) {
    showMaintenanceMode(generalSettings.content.maintenance_message || 'Site is under maintenance');
    return;
  }

  const content = generalSettings.content;
  const settings = generalSettings; // Use full settings object for phone, email, etc.

  // تحديث رقم الهاتف
  const phoneLinks = document.querySelectorAll('.phone-setting');
  if (settings.store_phone) {
    phoneLinks.forEach(link => {
      link.href = `tel:${settings.store_phone}`;
      link.innerHTML = `<i class="feather icon-phone-call text-primary"></i> ${settings.store_phone}`;
    });
  }

  // تحديث الإيميل
  const emailLinks = document.querySelectorAll('.email-setting');
  if (settings.store_email) {
    emailLinks.forEach(link => {
      link.href = `mailto:${settings.store_email}`;
      link.innerHTML = `<i class="feather icon-mail text-primary"></i> ${settings.store_email}`;
    });
  }

  // تحديث رابط الفيسبوك
  const facebookLinks = document.querySelectorAll('.facebook-setting');
  if (settings.facebook_url) {
    facebookLinks.forEach(link => {
      link.href = settings.facebook_url;
    });
  }

  // تحديث رابط الإنستجرام
  const instagramLinks = document.querySelectorAll('.instagram-setting');
  if (settings.instagram_url) {
    instagramLinks.forEach(link => {
      link.href = settings.instagram_url;
    });
  }

  // تحديث رابط الموعد (WhatsApp)
  const appointmentLinks = document.querySelectorAll('.whatsapp-setting');
  if (settings.store_phone) {
    appointmentLinks.forEach(link => {
      link.href = `https://api.whatsapp.com/send?phone=${settings.store_phone}&text&context=AffMX3rNCA1vEu-H-lm7x_A9zM4lbftdB9t0FPI_jQqeYxvxY8z5bMf3ICMptUcZ1UPEJVwB6hFCKdwajA9SRQ0tnbvcVtWtZHZPXn6zVchyUtJkzKDQ7Y6_OAdolwevONVHydwkGheqlH92hYSgkwg2wQ&source&app=facebook`;
    });
  }

  // تحديث الـ SEO meta tags (use content for meta fields)
  updateSEOTags(content);
  
  // تحديث الـ tracking scripts (use full settings object)
  updateTrackingScripts(settings);
}

// Show maintenance mode
function showMaintenanceMode(message) {
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 20px;">
      <div>
        <h1 style="font-size: 48px; margin-bottom: 20px;">Maintenance Mode</h1>
        <p style="font-size: 24px;">${message}</p>
      </div>
    </div>
  `;
}

// دالة لتحديث الـ SEO meta tags
function updateSEOTags(content) {
  // تحديث الـ title
  if (content.meta_title) {
    document.title = content.meta_title;
  } else if (content.store_name) {
    document.title = content.store_name;
  }

  // تحديث الـ meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    document.head.appendChild(metaDescription);
  }
  if (content.meta_description) {
    metaDescription.content = content.meta_description;
  }

  // تحديث الـ meta keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.name = 'keywords';
    document.head.appendChild(metaKeywords);
  }
  if (content.meta_keywords) {
    metaKeywords.content = content.meta_keywords;
  }

  // تحديث الـ Open Graph meta tags
  updateOpenGraphTags(content);
}

// دالة لتحديث الـ Open Graph meta tags
function updateOpenGraphTags(content) {
  // Open Graph Title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  if (content.meta_og_title || content.meta_title || content.store_name) {
    ogTitle.content = content.meta_og_title || content.meta_title || content.store_name;
  }

  // Open Graph Description
  let ogDescription = document.querySelector('meta[property="og:description"]');
  if (!ogDescription) {
    ogDescription = document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    document.head.appendChild(ogDescription);
  }
  if (content.meta_og_description || content.meta_description) {
    ogDescription.content = content.meta_og_description || content.meta_description;
  }

  // Open Graph Site Name
  let ogSiteName = document.querySelector('meta[property="og:site_name"]');
  if (!ogSiteName) {
    ogSiteName = document.createElement('meta');
    ogSiteName.setAttribute('property', 'og:site_name');
    document.head.appendChild(ogSiteName);
  }
  if (content.meta_og_site_name || content.store_name) {
    ogSiteName.content = content.meta_og_site_name || content.store_name;
  }
}

// دالة لتحديث الـ tracking scripts
function updateTrackingScripts(settings) {
  // Google Tag Manager
  if (settings.gtm_enabled && settings.gtm_container_id) {
    addGoogleTagManager(settings.gtm_container_id);
  }

  // Google Analytics
  if (settings.google_analytics_enabled && settings.google_analytics_id) {
    addGoogleAnalytics(settings.google_analytics_id);
  }

  // Facebook Pixel
  if (settings.facebook_pixel_enabled && settings.facebook_pixel_id) {
    addFacebookPixel(settings.facebook_pixel_id);
  }

  // Snapchat Pixel
  if (settings.snapchat_pixel_enabled && settings.snapchat_pixel_id) {
    addSnapchatPixel(settings.snapchat_pixel_id);
  }

  // TikTok Pixel
  if (settings.init_tiktok_enabled && settings.init_tiktok_id) {
    addTikTokPixel(settings.init_tiktok_id);
  }
}

// دالة إضافة Google Analytics
function addGoogleAnalytics(gaId) {
  // Google Analytics 4
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(gaScript);

  const gaConfig = document.createElement('script');
  gaConfig.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}');
  `;
  document.head.appendChild(gaConfig);
}

// دالة إضافة Google Tag Manager
function addGoogleTagManager(gtmId) {
  // GTM Script
  const gtmScript = document.createElement('script');
  gtmScript.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `;
  document.head.appendChild(gtmScript);

  // GTM NoScript
  const gtmNoScript = document.createElement('noscript');
  gtmNoScript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
  document.body.insertBefore(gtmNoScript, document.body.firstChild);
}

// دالة إضافة Facebook Pixel
function addFacebookPixel(pixelId) {
  const fbScript = document.createElement('script');
  fbScript.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(fbScript);

  const fbNoScript = document.createElement('noscript');
  fbNoScript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"/>`;
  document.head.appendChild(fbNoScript);
}

// دالة إضافة Snapchat Pixel
function addSnapchatPixel(pixelId) {
  const snapScript = document.createElement('script');
  snapScript.innerHTML = `
    (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
    {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
    a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
    r.src='https://tr.snapchat.com/tr.js';var u=t.getElementsByTagName(s)[0];
    u.parentNode.insertBefore(r,u);})(window,document);
    snaptr('init', '${pixelId}', {
      'user_email': '__INSERT_USER_EMAIL__'
    });
    snaptr('track', 'PAGE_VIEW');
  `;
  document.head.appendChild(snapScript);
}

// دالة إضافة TikTok Pixel
function addTikTokPixel(pixelId) {
  const tiktokScript = document.createElement('script');
  tiktokScript.innerHTML = `
    !function (w, d, t) {
      w.TikTokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["track","page","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
      ttq.load('${pixelId}');
      ttq.page();
    }(window, document, 'ttq');
  `;
  document.head.appendChild(tiktokScript);
}

