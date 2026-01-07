import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonImg,
} from '@ionic/react';
import {
  cameraOutline,
  calendarOutline,
  imagesOutline,
  peopleOutline,
  schoolOutline,
  videocamOutline,
  sparklesOutline,
  timeOutline,
  locationOutline,
  camera,
  layersOutline,
  giftOutline,
  checkmarkCircleOutline,
  heartOutline,
  businessOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();
  const [hasHeroBg, setHasHeroBg] = useState(true);
  const [hasCtaBg, setHasCtaBg] = useState(true);
  const navItems = [
    { label: 'Главная', target: 'hero' },
    { label: 'Пакеты', target: 'packages' },
    { label: 'Преимущества', target: 'features' },
    { label: 'Услуги', target: 'services' },
  ];

  // Проверяем наличие изображений при загрузке
  useEffect(() => {
    const checkImages = async () => {
      try {
        // Проверяем hero-bg.jpg
        const heroResponse = await fetch('/assets/images/hero-bg.jpg');
        if (!heroResponse.ok) setHasHeroBg(false);
        
        // Проверяем cta-bg.jpg
        const ctaResponse = await fetch('/assets/images/cta-bg.jpg');
        if (!ctaResponse.ok) setHasCtaBg(false);
      } catch (error) {
        console.log('Используем фоновые изображения по умолчанию');
        setHasHeroBg(false);
        setHasCtaBg(false);
      }
    };
    
    checkImages();
  }, []);

  // Пакеты выпускных альбомов
  const albumPackages = [
    {
      name: 'КЛАСС',
      price: '2 950',
      badge: 'Популярный',
      details: [
        { icon: layersOutline, text: '3 разворота (6 страниц)' },
        { icon: camera, text: '1 съемка - 1 образ' },
        { icon: timeOutline, text: 'Продолжительность 2 часа' },
        { icon: locationOutline, text: 'Студия или выезд' },
        { icon: videocamOutline, text: 'Оживающие фото на всех общих/групповых фото' },
      ],
      description: 'Яркая память о школьных годах и друзьях. Идеально подойдет для тех, кто хочет сохранить свои школьные воспоминания в стильном и компактном формате.',
      image: '/assets/images/package-class.jpg', // Добавьте эту картинку
    },
    {
      name: 'ХИТ',
      price: '4 200',
      badge: 'Бестселлер',
      details: [
        { icon: layersOutline, text: '10 разворотов (20 страниц)' },
        { icon: camera, text: '1 съемка - 2 образа (школьная и свободная)' },
        { icon: timeOutline, text: 'Продолжительность 3 часа' },
        { icon: locationOutline, text: 'Студия или выезд' },
        { icon: videocamOutline, text: 'Оживающие фото на всех общих/групповых фото' },
        { icon: sparklesOutline, text: 'Индивидуальная фото ученика + виньетка' },
      ],
      description: 'В комплект входит индивидуальная фотография ученика с цитатой, виньетка каждого ученика. Идеально для тех, кто хочет сохранить богатую историю выпуска.',
      image: '/assets/images/package-hit.jpg', // Добавьте эту картинку
    },
    {
      name: 'СУПЕР',
      price: '6 950',
      badge: 'Премиум',
      details: [
        { icon: layersOutline, text: '18 разворотов' },
        { icon: camera, text: '3 съемки (студийная, школьная выездная)' },
        { icon: timeOutline, text: 'До 3 часов на съемку' },
        { icon: locationOutline, text: 'Разные локации съемок' },
        { icon: videocamOutline, text: 'Оживающие фото на всех общих/групповых фото' },
        { icon: sparklesOutline, text: '4 индивидуальных фото + виньетка класса' },
        { icon: giftOutline, text: 'Максимальное разнообразие снимков' },
      ],
      description: 'Подарите себе незабываемую память о школьных годах! Яркое собрание лучших моментов с тремя разными фотосессиями. Идеально для тех, кто ценит качество и разнообразие.',
      image: '/assets/images/package-super.jpg', // Добавьте эту картинку
    },
  ];

  // Дополнительные услуги
  const additionalServices = [
    { name: 'Архивный разворот', price: '100', icon: '📂' },
    { name: 'Дополнительная съемка', price: '1 200', icon: '📷' },
    { name: 'Виньетка учителей', price: '4 000', icon: '👨‍🏫' },
    { name: 'Разворот желаний', price: '150', icon: '💭' },
    { name: 'Интервью ученика', price: '1 200', icon: '🎤' },
  ];

  // Особенности
  const features = [
    {
      icon: videocamOutline,
      title: 'Оживающие фото',
      description: 'Снимки превращаются в видео при наведении телефона',
    },
    {
      icon: schoolOutline,
      title: 'Специализированная студия',
      description: 'Единственная в Якутске студия для выпускных альбомов',
    },
    {
      icon: checkmarkCircleOutline,
      title: 'Гибкие условия',
      description: 'Разные пакеты для классов, скидки для учителей и близнецов',
    },
  ];

  const handleNavClick = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="logo-title">Выпускные альбомы | Якутск</IonTitle>
          <IonButtons slot="end" className="top-nav-buttons">
            {navItems.map((item) => (
              <IonButton
                key={item.target}
                fill="clear"
                color="light"
                onClick={() => handleNavClick(item.target)}
              >
                {item.label}
              </IonButton>
            ))}
            <IonButton
              fill="solid"
              color="light"
              className="auth-button"
              onClick={() => history.push('/login')}
            >
              <IonIcon icon={peopleOutline} slot="start" />
              Войти
            </IonButton>
            <IonButton
              color="light"
              shape="round"
              className="nav-cta"
              onClick={() => history.push('/orders/new')}
            >
              Заявка для класса
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="home-content">
        {/* Hero Section - с проверкой фона */}
        <section
          id="hero"
          className={`hero-section ${!hasHeroBg ? 'no-bg' : ''}`}
        >
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-title">ШКОЛЬНЫЕ ВЫПУСКНЫЕ АЛЬБОМЫ</h1>
              <p className="hero-subtitle">
                Ловим эмоции - сохраняем истории. Профессиональные выпускные альбомы 
                для 11-х и 4-х классов с оживающими фото
              </p>
              <IonButton
                size="large"
                color="light"
                onClick={() => history.push('/orders/new')}
                className="hero-button"
              >
                <IonIcon icon={calendarOutline} slot="start" />
                Рассчитать стоимость для класса
              </IonButton>
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section id="packages" className="packages-section">
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <h2 className="section-title">Пакеты выпускных альбомов</h2>
                <IonText color="medium" className="text-center">
                  <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.1rem' }}>
                    Выберите подходящий вариант для вашего класса
                  </p>
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              {albumPackages.map((pkg, index) => (
                <IonCol size="12" sizeMd="4" key={index}>
                  <IonCard className="package-card">
                    {pkg.badge && <div className="package-badge">{pkg.badge}</div>}
                    
                    {/* Добавляем изображение для пакета */}
                    <div 
                      className="package-header"
                      style={{ 
                        background: `linear-gradient(135deg, rgba(26, 109, 204, 0.9) 0%, rgba(13, 77, 156, 0.9) 100%), 
                        url(${pkg.image || '/assets/images/default-package.jpg'}) center/cover`
                      }}
                    >
                      <IonCardTitle className="package-name">{pkg.name}</IonCardTitle>
                      <div className="package-price">
                        {pkg.price} <span>руб</span>
                      </div>
                    </div>
                    
                    <IonCardContent className="package-details">
                      {pkg.details.map((detail, idx) => (
                        <div className="detail-item" key={idx}>
                          <IonIcon icon={detail.icon} className="detail-icon" />
                          <span>{detail.text}</span>
                        </div>
                      ))}
                      <p style={{ marginTop: '1.5rem', color: '#666', lineHeight: '1.6' }}>
                        {pkg.description}
                      </p>
                      <IonButton
                        expand="block"
                        style={{ marginTop: '1.5rem' }}
                        onClick={() => history.push(`/orders/new?package=${pkg.name}`)}
                      >
                        Выбрать этот пакет
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <h2 className="section-title">Наши преимущества</h2>
              </IonCol>
            </IonRow>
            <IonRow>
              {features.map((feature, index) => (
                <IonCol size="12" sizeMd="4" key={index}>
                  <IonCard className="feature-card">
                    <IonCardHeader>
                      <IonIcon icon={feature.icon} className="feature-icon" />
                      <IonCardTitle>{feature.title}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      {feature.description}
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </section>

        {/* Additional Services */}
        <section id="services" className="services-section">
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <h2 className="section-title">Дополнительные услуги</h2>
                <IonText color="medium" className="text-center">
                  <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem' }}>
                    Дополните свой альбом уникальными возможностями
                  </p>
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              {additionalServices.map((service, index) => (
                <IonCol size="12" sizeMd="6" sizeLg="4" key={index}>
                  <IonCard className="service-card">
                    <IonCardHeader>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        {service.icon}
                      </div>
                      <IonCardTitle>{service.name}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <div className="service-price">{service.price} руб</div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </section>

        {/* CTA Section - с проверкой фона */}
        <section className={`cta-section ${!hasCtaBg ? 'no-bg' : ''}`}>
          <IonCard className="cta-card">
            <IonCardHeader>
              <IonCardTitle>Готовы создать незабываемый выпускной альбом?</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                Заполните простую форму, и мы рассчитаем стоимость для всего класса 
                с учётом всех пожеланий и скидок. Оставьте заявку прямо сейчас!
              </p>
              <IonButton
                expand="block"
                size="large"
                onClick={() => history.push('/orders/new')}
                className="cta-button"
              >
                <IonIcon icon={calendarOutline} slot="start" />
                Оставить заявку для класса
              </IonButton>
              <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#777' }}>
                Или позвоните нам: <strong>+7 (XXX) XXX-XX-XX</strong>
              </p>
            </IonCardContent>
          </IonCard>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Home;