import { useEffect, useRef, useState } from "react";
import "./exploded-video.css";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const paragraphs = {
  aperture: "这不是一台做成积木样子的手机，而是一台可以继续被搭建的手机。陶瓷白机身以精密的模块网格为基础，让每一个连接点都成为下一种能力的入口。熟悉的拼搭直觉，被重新翻译成克制、可靠的工业设计。",
  detail: "真正让人记住的，是扣合瞬间的确定感。精细凸点、圆润边缘与磁吸结构共同校准手感；轻轻一扣，清脆反馈和低频冲击同时抵达，功能无需说明便已就位。",
  landscape: "色彩服务于速度、能量与秩序。陶瓷白定义产品本体，科技蓝描绘能量路径，荧光橙标记关键动作；三种色彩共同构成一套高性能、可持续扩展的视觉语言。",
  system: "当手机成为可生长的平台，所有模块都必须遵循同一套网格、连接方式和视觉节奏。无论是电源、支架还是未来配件，组合前后都保持清晰、完整，并让扩展像拼搭一样自然。",
};

function MenuMark({ open = false }) {
  return (
    <span className={"menu-mark" + (open ? " is-open" : "")} aria-hidden="true">
      <span /><span /><span />
    </span>
  );
}

function MediaSlot({ label, tone = "fog", className = "", parallax = false, aspect }) {
  return (
    <div
      className={"media-slot tone-" + tone + (parallax ? " parallax-media" : "") + " " + className}
      style={aspect ? { "--slot-aspect": aspect } : undefined}
      role="img"
      aria-label={label + "，概念设计媒体区域"}
    >
      <div className="media-slot__surface">
        <span className="media-slot__label">{label}</span>
        <span className="media-slot__hint">Concept media</span>
      </div>
    </div>
  );
}


function RealMedia({ src, alt, className = "", parallax = false, aspect, fit = "cover", position = "center", background = "#f2f2ef", priority = false }) {
  return (
    <figure
      className={"media-slot real-media" + (parallax ? " parallax-media" : "") + " " + className}
      style={{
        ...(aspect ? { "--slot-aspect": aspect } : {}),
        "--media-fit": fit,
        "--media-position": position,
        "--media-bg": background,
      }}
    >
      <img src={assetUrl(src)} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" fetchPriority={priority ? "high" : "auto"} />
    </figure>
  );
}

function ViewportVideo({ src, poster, className = "", label }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const playback = video.play();
        if (playback) playback.catch(() => {});
      } else {
        video.pause();
      }
    }, { threshold: 0.28 });

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      src={assetUrl(src)}
      poster={assetUrl(poster)}
      muted
      playsInline
      loop
      preload="metadata"
      aria-label={label}
    />
  );
}
function Reveal({ as: Tag = "div", className = "", delay = 0, children, ...props }) {
  return (
    <Tag className={"reveal " + className} style={{ "--reveal-delay": delay + "ms" }} {...props}>
      {children}
    </Tag>
  );
}

function Header({ menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);
  const links = [["概念起点", "#story"], ["能量色彩", "#materials"], ["模块系统", "#system"]];
  return (
    <>
      <header className={"site-header" + (scrolled ? " is-scrolled" : "")}>
        <a className="wordmark" href="#top" aria-label="TECNO，回到页面顶部">
          <img src={assetUrl("/brand/tecno-logo.svg")} alt="TECNO" />
        </a>
        <nav className="desktop-nav" aria-label="主导航">
          {links.map(([label, href], index) => (
            <a className={index === 0 ? "is-active" : ""} href={href} key={href}>{label}</a>
          ))}
        </nav>
        <button className="menu-button" type="button" aria-label={menuOpen ? "关闭菜单" : "打开菜单"} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
          <MenuMark open={menuOpen} />
        </button>
      </header>
      <div className={"mobile-menu" + (menuOpen ? " is-open" : "")} aria-hidden={!menuOpen}>
        <div className="mobile-menu__veil" onClick={() => setMenuOpen(false)} />
        <nav className="mobile-menu__panel" aria-label="移动端导航">
          <p>CONTENTS</p>
          {links.map(([label, href], index) => (
            <a href={href} key={href} onClick={() => setMenuOpen(false)} style={{ "--menu-index": index }}>
              <span>0{index + 1}</span>{label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}

function IntroSection() {
  return (
    <section className="editorial editorial--split section-pad" id="story">
      <div className="editorial__copy">
        <Reveal as="h2">如果手机，也能继续搭建？</Reveal>
        <Reveal as="p" delay={100}>{paragraphs.aperture}</Reveal>
        <Reveal as="p" delay={180}>我们从小时候拼搭积木的直觉出发，把自由组合变成手机设计的一部分。背部与下半区不是封闭的终点，而是一块等待扩展的界面：对准、靠近、扣合，一次简单动作便能为手机增加新的能力。</Reveal>
      </div>
      <RealMedia src="/media/phone-angle.png" alt="白色模块化概念手机背部斜视图" className="intro-product-media" parallax aspect="5 / 3" fit="contain" background="#fff" />
    </section>
  );
}

function DetailSection() {
  return (
    <section className="detail-section section-pad">
      <div className="detail-section__inner">
        <section className="brand-morph-section detail-section__brand-morph" aria-label="LEGO 与 TECNO 动态联名标志">
          <div className="detail-section__brand-media">
            <ViewportVideo
              className="brand-morph-feature"
              src="/media/brand-morph-loop.mp4"
              label="LEGO 与 TECNO 积木动态联名标志"
            />
            <figure className="detail-section__brand-character">
              <img src={assetUrl("/media/lego-woody.jpg")} alt="牛仔造型乐高人物" loading="lazy" decoding="async" />
            </figure>
          </div>
          <div className="detail-section__brand-copy">
            <Reveal as="p" className="eyebrow">CO-BUILD IDENTITY</Reveal>
            <Reveal as="h3">一格一格，拼成共同标识</Reveal>
            <Reveal as="p" delay={100}>红色底板承接乐高的拼搭记忆，像素化颗粒逐步组成联名标志。每个单元可以独立存在，也能沿着统一网格组合成完整系统——这正是模块化手机的设计逻辑。</Reveal>
          </div>
        </section>
        <div className="detail-collage">
          <RealMedia src="/media/side-profile.png" alt="模块化手机横向侧面轮廓" className="detail-collage__top" aspect="4 / 1" fit="contain" background="#fff" />
          <RealMedia src="/media/edge-profile.png" alt="模块化手机超薄侧边细节" className="detail-collage__side" aspect="4 / 1" fit="contain" background="#fff" />
          <RealMedia src="/media/camera-closeup.png" alt="蓝色相机环与黄色按键细节" className="detail-collage__bottom" aspect="16 / 7" fit="contain" background="#fff" />
          <Reveal as="p" className="detail-collage__note" delay={150}>一枚荧光橙触点标记模块的方向。它既提示操作，也在大面积陶瓷白与科技蓝之间建立醒目的性能坐标。</Reveal>
        </div>
      </div>
    </section>
  );
}

function LandscapeRow({ title, subline, copy, reverse = false, slot, eyebrow = "ENERGY PALETTE" }) {
  const mediaBySlot = {
    "CERAMIC WHITE / 03": ["/media/phone-angle.png", "模块化概念手机背部斜视图"],
    "ELECTRIC BLUE / 04": ["/media/side-profile.png", "科技蓝镜头环与黄色侧键细节"],
    "RACING ORANGE / 05": ["/media/camera-closeup.png", "蓝色镜头环与竞速色触点细节"],
  };
  const [src, alt] = mediaBySlot[slot];
  return (
    <section className={"landscape-row" + (reverse ? " is-reverse" : "")}>
      <RealMedia src={src} alt={alt} aspect="1 / 1" fit="contain" background="#fff" />
      <div className="landscape-row__copy">
        <Reveal as="p" className="eyebrow">{eyebrow}</Reveal>
        <Reveal as="h3">{title}</Reveal>
        <Reveal as="h4" delay={90}>——{subline}</Reveal>
        <Reveal as="p" delay={160}>{copy}</Reveal>
      </div>
    </section>
  );
}
function StructureChapter() {
  return (
    <section className="structure-chapter section-pad">
      <Reveal as="p" className="eyebrow eyebrow--center">CHAPTER 03 / MODULAR GRID</Reveal>
      <Reveal as="h2">从一台手机，到可生长的平台</Reveal>
      <RealMedia src="/media/collab-lockup.png" alt="LEGO 与 TECNO 概念合作标识" className="structure-chapter__hero" aspect="16 / 7" fit="contain" background="#fff" />
    </section>
  );
}

function ProductChapter({ id, title, kicker, copy, reverse = false, slot, secondarySlot, hideMedia = false }) {
  const mediaBySlot = {
    "POWER MODULE / 09": ["/media/power-module.png", "白色积木式磁吸背夹电源模块", "4 / 5", "contain"],
    "MAGNETIC SNAP / 10": ["/media/magnetic-snap-composite.jpg", "原始手机与电源模块接近磁吸扣合", "16 / 9", "cover"],
    "RACING WORLD / 18": ["/media/racing-world-composite.jpg", "原始模块化手机置于白色积木竞速世界", "16 / 9", "cover"],
    "CAMERA MODULE / 11": ["/media/camera-module.png", "白色积木式磁吸相机模块", "4 / 3", "contain"],
    "POCKET PRINTER / 12": ["/media/portable-printer.png", "白色积木式便携打印机模块", "4 / 3", "contain"],
    "EXTEND SCREEN / 13": ["/media/extend-screen-keyboard.png", "拓展屏幕展开为电子键盘", "4 / 3", "contain"],
    "EXTEND SCREEN STANDBY / 14": ["/media/extend-screen-standby.png", "拓展屏幕作为第二显示区待机展示", "4 / 3", "contain"],
  };
  const [src, alt, aspect, fit] = mediaBySlot[slot];
  const secondaryMedia = secondarySlot ? mediaBySlot[secondarySlot] : null;
  return (
    <section className={"product-chapter section-pad" + (reverse ? " is-reverse" : "") + (hideMedia ? " product-chapter--text-only" : "")} id={id}>
      <div className="product-chapter__copy">
        <Reveal as="p" className="eyebrow">{kicker}</Reveal>
        <Reveal as="h2">{title}</Reveal>
        <Reveal as="p" delay={110}>{copy}</Reveal>
      </div>
      {!hideMedia && (
        <div className={"product-chapter__media-wrap" + (secondaryMedia ? " has-secondary" : "")}>
          <RealMedia src={src} alt={alt} className="generated-chapter-media" aspect={aspect} fit={fit} background="#fff" />
          {secondaryMedia && (
            <RealMedia src={secondaryMedia[0]} alt={secondaryMedia[1]} className="generated-chapter-media generated-chapter-media--secondary" aspect={secondaryMedia[2]} fit={secondaryMedia[3]} background="#fff" />
          )}
        </div>
      )}
    </section>
  );
}
function ConnectionBalanceSection() {
  return (
    <section className="connection-balance section-pad">
      <div className="connection-balance__copy">
        <Reveal as="p" className="eyebrow">MAGNETIC CONNECTION / SLIM POWER STUDY</Reveal>
        <Reveal as="h2">咔哒一声，完成上电</Reveal>
        <Reveal as="p" delay={100}>对位、减速、吸附、锁定被压缩成一次清脆反馈；超薄背夹电源贴合机身下半部，把新增重量放在握持更稳定的位置。连接后的轮廓依旧干净，功能扩展被收进一次自然扣合里。</Reveal>
      </div>
      <div className="connection-balance__media">
        <RealMedia src="/media/handheld-module.png" alt="双手展示原始手机与扩展电源模块" aspect="4 / 3" fit="contain" background="#fff" />
      </div>
    </section>
  );
}

function AdapterSection() {
  return (
    <section className="adapter-section section-pad">
      <Reveal as="p" className="eyebrow">ONE GRID / MORE POSSIBILITIES</Reveal>
      <Reveal as="h2">一个接口，无限搭法</Reveal>
      <section className="wide-media exploded-video-section adapter-section__exploded-video">
        <ViewportVideo
          className="exploded-video"
          src="/media/module-explosion.mp4"
          poster="/media/exploded-system.png"
          label="模块化概念手机爆炸图动画"
        />
      </section>
      <Reveal as="p">统一接口先交代模块的共同语言：同一网格、同一扣合方向、同一视觉节奏。下面每一个配件都像独立积木块，分别解决续航、拍摄、即时输出与移动输入场景；功能不断变化，熟悉的扣合动作始终不变。</Reveal>
    </section>
  );
}

function EngineeringFeature() {
  return (
    <section className="generated-feature generated-feature--text-only section-pad">
      <div className="generated-feature__copy">
        <Reveal as="p" className="eyebrow">POWER ENGINEERING</Reveal>
        <Reveal as="h2">把复杂工程，藏进一块模块</Reveal>
        <Reveal as="p" delay={100}>电芯、磁体、散热与结构锁点被压缩在超薄体积中。原始手机与电源模块保持既有造型，技术场景只负责解释连接逻辑。</Reveal>
      </div>
   </section>
  );
}

function PackagingFeature() {
  return (
    <section className="generated-feature generated-feature--packaging section-pad">
      <div className="generated-feature__copy">
        <Reveal as="p" className="eyebrow">START BUILDING</Reveal>
        <Reveal as="h2">从第一块，开始搭建</Reveal>
        <Reveal as="p" delay={100}>手机是核心，电源是第一块扩展。精确的包装槽位让模块化顺序在开箱的一刻就被理解。</Reveal>
      </div>
      <RealMedia src="/media/packaging-build-your-own.png" alt="TECNO 模块化手机与相机、打印机配件的乐高风格包装展示" aspect="2 / 3" fit="contain" background="#fff" />
    </section>
  );
}
function ClosingSection() {
  return (
    <section className="closing-section" id="closing">
      <RealMedia src="/media/hero-collab.png" alt="TECNO 模块化手机与积木角色合作主视觉" aspect="16 / 8" fit="cover" background="#fff" />
      <div className="closing-section__copy section-pad">
        <Reveal as="p" className="eyebrow">BUILD YOUR POWER.</Reveal>
        <Reveal as="h2">拼出你的能量</Reveal>
        <Reveal as="p" delay={110}>积木式结构是形式，快速扩展能量才是价值。我们把复杂工程整理成一次直觉动作，让手机不再是被定义完成的产品，而是一个可以随需求继续生长的伙伴。</Reveal>
      </div>
      <div className="team section-pad">
        <Reveal as="p" className="eyebrow">TECNO MODULAR CONCEPT</Reveal>
        <Reveal as="h3">为下一块能力，留下位置</Reveal>
        <Reveal as="p" delay={100}>Concept Strategy / Industrial Design / CMF / Interaction / Engineering</Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <a className="site-footer__brand" href="#top" aria-label="TECNO，回到页面顶部">
          <img src={assetUrl("/brand/tecno-logo.svg")} alt="TECNO" />
        </a>
        <div><p>CONCEPT</p><span>MODULAR PHONE / 2026</span></div>
        <div><p>SECTIONS</p><a href="#story">概念起点</a><a href="#materials">能量色彩</a><a href="#system">模块系统</a></div>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>返回顶部 ↑</button>
      </div>
      <div className="site-footer__bottom"><span>BRICK-BUILT MODULAR PHONE CONCEPT</span><span>BUILD YOUR POWER. / 2026</span></div>
    </footer>
  );
}

function usePageMotion(heroMediaRef, heroVideoRef) {
  useEffect(() => {
    const heroMedia = heroMediaRef.current;
    const parallaxItems = Array.from(document.querySelectorAll(".parallax-media"));
    const visibleParallax = new Set();
    let animationFrame = 0;
    let resizeTimer = 0;
    let videoStarted = false;
    function startHeroVideo() {
      const video = heroVideoRef.current;
      if (videoStarted || !video) return;
      videoStarted = true;
      video.currentTime = 0;
      const playback = video.play();
      if (playback) playback.catch(() => {});
    }
    const heroVideo = heroVideoRef.current;
    const videoEntryObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) startHeroVideo();
    }, { threshold: 0.01 });
    if (heroMedia) videoEntryObserver.observe(heroMedia);

    const parallaxObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting ? visibleParallax.add(entry.target) : visibleParallax.delete(entry.target));
      requestUpdate();
    }, { threshold: 0, rootMargin: "0px" });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("is-visible", entry.isIntersecting));
    }, { threshold: 0.32, rootMargin: "10% 0px 5% 0px" });

    parallaxItems.forEach((item) => parallaxObserver.observe(item));
    document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));



    function clamp(value, minimum, maximum) { return Math.min(maximum, Math.max(minimum, value)); }
    function updateMotion() {
      animationFrame = 0;
      const viewportHeight = window.innerHeight;
      if (heroMedia && window.innerWidth > 649) {
        const heroTop = heroMedia.getBoundingClientRect().top + window.scrollY;
        const progress = clamp(window.scrollY / Math.max(heroTop, 1), 0, 1);
        const initialWidth = clamp(window.innerWidth * 1.083333, 780, 1680);
        const width = initialWidth + (window.innerWidth - initialWidth) * progress;
        const scale = 0.6 + 0.4 * progress;
        heroMedia.style.setProperty("--hero-width", width + "px");
        heroMedia.style.setProperty("--hero-scale", scale.toFixed(4));
      }
      visibleParallax.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
        const translate = clamp(-5 + progress * 9.5, -4.5, 4.5);
        item.style.setProperty("--parallax-y", translate.toFixed(3) + "%");
      });
    }
    function requestUpdate() { if (!animationFrame) animationFrame = requestAnimationFrame(updateMotion); }
    function onResize() { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(requestUpdate, 150); }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", onResize);
    requestUpdate();
    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(resizeTimer);
      parallaxObserver.disconnect();
      revealObserver.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", onResize);
      videoEntryObserver.disconnect();
    };
  }, [heroMediaRef, heroVideoRef]);
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroMediaRef = useRef(null);
  const heroVideoRef = useRef(null);
  usePageMotion(heroMediaRef, heroVideoRef);
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  return (
    <div className="page-shell" id="top">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        <section className="hero">
          <div className="hero__title-copy">
            <Reveal as="h1">拼出你的能量</Reveal>
            <Reveal as="p" className="hero__subtitle" delay={100}>BUILD YOUR POWER. / MODULAR PHONE CONCEPT</Reveal>
          </div>
          <div className="hero__media-stage"><div className="hero__media" ref={heroMediaRef}><video ref={heroVideoRef} className="hero-scroll-video" src={assetUrl("/media/scroll-reveal.mp4")} muted playsInline preload="metadata" aria-label="TECNO 模块化概念手机设计影片" /></div></div>
        </section>

        <IntroSection />
        <DetailSection />



        <div className="landscape-stack" id="materials">
          <LandscapeRow eyebrow="DIY MODULAR SYSTEM" title="拼出你的手机" subline="像乐高一样，让功能与想象自由嵌合。" copy="从镜头、电源到更多功能模块，每一次扣合都像完成一块积木拼搭。标准化接口让乐高式 DIY 真正进入手机：需要什么，就装上什么；想换一种玩法，随时拆开、重组，再继续搭建。" slot="CERAMIC WHITE / 03" />
        </div>

        <StructureChapter />


        <ProductChapter id="system" kicker="CHAPTER 04 / BUILD YOUR POWER" title="超薄背夹电源" copy="第一块被拼上的能力，是更长的续航。模块从机身下方精准靠近，磁吸扣合后与背部齐平；蓝色能量沿接缝亮起，额外电量即刻就位。" tone="fog" slot="POWER MODULE / 09" reverse />

        <ConnectionBalanceSection />
        <AdapterSection />
        <ProductChapter id="camera" kicker="CHAPTER 05 / CAPTURE MODULE" title="磁吸相机模块" copy="当手机进入创作场景，镜头模块变成可以随时扣上的影像积木。旅行、Vlog、细节记录或低角度拍摄时，它把更专用的成像能力交给外置模块；日常使用则保持手机轻薄。" tone="paper" slot="CAMERA MODULE / 11" />
        <ProductChapter id="printer" kicker="CHAPTER 06 / INSTANT OUTPUT" title="便携打印模块" copy="便携打印模块把照片、便签、票据和标签从屏幕里取出来。它解决现场分享、桌面整理、灵感记录时“看得到却拿不走”的问题，让手机从记录工具变成即时输出工具。" tone="fog" slot="POCKET PRINTER / 12" reverse />
        <ProductChapter id="extend-screen" kicker="CHAPTER 07 / EXTEND SCREEN" title="拓展屏幕 / 电子键盘" copy="拓展屏幕平时承担第二显示区：通知、资料、聊天或工具栏都可以被移出主屏。需要输入时，它展开为电子键盘，解决移动办公和文档编辑中屏幕被键盘占据、输入效率下降的问题。" tone="paper" slot="EXTEND SCREEN / 13" secondarySlot="EXTEND SCREEN STANDBY / 14" />
        <EngineeringFeature />
        <PackagingFeature />
        <ClosingSection />

      </main>
      <Footer />
    </div>
  );
}
