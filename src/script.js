import './main.css';
import { Clock, Scene, LoadingManager, WebGLRenderer, sRGBEncoding, Group, PerspectiveCamera, DirectionalLight, PointLight, MeshPhongMaterial } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';


// Yükleme yönetici fonksiyonu, modellerin yüklenmesi tamamlandığında animasyon başlatır
// Loading manager function that initiates animation after models are fully loaded
const ftsLoader = document.querySelector(".lds-roller");
const loadingCover = document.getElementById("loading-text-intro");
const loadingManager = new LoadingManager();

loadingManager.onLoad = function() {
    document.querySelector(".main-container").style.visibility = 'visible';
    document.querySelector("body").style.overflow = 'auto';

    const yPosition = { y: 0 };
    new TWEEN.Tween(yPosition).to({ y: 200 }, 900).easing(TWEEN.Easing.Quadratic.InOut).start()
        .onUpdate(function () {
            loadingCover.style.setProperty('transform', `translate( 0, ${yPosition.y}%)`);
        })
        .onComplete(function () {
            if (document.getElementById("loading-text-intro")) {
                loadingCover.parentNode.removeChild(document.getElementById("loading-text-intro"));
            }
            TWEEN.remove(this);
        });

    introAnimation();
    ftsLoader.parentNode.removeChild(ftsLoader);
    window.scroll(0, 0);
};


// Blender'dan Draco sıkıştırmalı modelleri yüklemek için Draco Loader kullanımı
// Usage of Draco loader to load Draco compressed models from Blender
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
dracoLoader.setDecoderConfig({ type: 'js' });
const loader = new GLTFLoader(loadingManager);
loader.setDRACOLoader(dracoLoader);


// Three.js deneyimini içerecek div container oluşturulması
// Creating div container to hold the Three.js experience
const container = document.getElementById('canvas-container');
const containerDetails = document.getElementById('canvas-container-details');


// Genel değişkenlerin tanımlanması
// Definition of general variables
let oldMaterial;
let secondContainer = false;
let width = container.clientWidth;
let height = container.clientHeight;


// Ana ve ikinci sahne oluşturulması
// Creating main and second scenes
const scene = new Scene(); // Themis sahnesi için ana sahne // Main scene for Themis
const sceneSecond = new Scene(); // Sekmelere özel modeller için ikinci sahne // Second scene for tab-specific models


// Render ayarları yapılarak sahneye ekleniyor
// Renderer configuration and adding to scene
const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
renderer.autoClear = true;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer.setSize(width, height);
renderer.outputEncoding = sRGBEncoding;
container.appendChild(renderer.domElement);

const rendererSecond = new WebGLRenderer({ antialias: false });
rendererSecond.setPixelRatio(Math.min(window.devicePixelRatio, 1));
rendererSecond.setSize(width, height);
rendererSecond.outputEncoding = sRGBEncoding;
containerDetails.appendChild(rendererSecond.domElement);


// Kamera gruplarının ve kameraların sahneye eklenmesi
// Adding camera groups and cameras to the scene
const cameraGroup = new Group();
scene.add(cameraGroup);

const camera = new PerspectiveCamera(35, width / height, 1, 100);
camera.position.set(19, 1.54, 2);
cameraGroup.add(camera);

const cameraSecond = new PerspectiveCamera(50, containerDetails.clientWidth / containerDetails.clientHeight, 1, 100);
cameraSecond.position.set(0, 2, 5);
cameraSecond.lookAt(sceneSecond.position);
sceneSecond.add(cameraSecond);

// Ekran boyutu değiştiğinde kameraların ve render boyutlarının güncellenmesi
// Updating camera and render sizes on window resize
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    cameraSecond.aspect = containerDetails.clientWidth / containerDetails.clientHeight;
    cameraSecond.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
    rendererSecond.setSize(containerDetails.clientWidth, containerDetails.clientHeight);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    rendererSecond.setPixelRatio(Math.min(window.devicePixelRatio, 1));
});

// Ana ve ikinci sahne için ışıkların eklenmesi
// Adding lights for the main and second scenes
const sunLight = new DirectionalLight(0x435c72, 0.08);
sunLight.position.set(-100, 0, -100);
scene.add(sunLight);

const fillLight = new PointLight(0x88b2d9, 2.7, 4, 3);
fillLight.position.set(30, 3, 1.8);
scene.add(fillLight);

const directionalLightSecond = new DirectionalLight(0xffffff, 2);
directionalLightSecond.position.set(10, 10, 10);
sceneSecond.add(directionalLightSecond);

const ambientLightSecond = new THREE.AmbientLight(0xffffff, 1);
sceneSecond.add(ambientLightSecond);


// Blender'dan GLB/GLTF model yükleme işlemi
// Loading GLB/GLTF model from Blender
loader.load('models/gltf/themis.glb', function (gltf) {
    gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
            oldMaterial = obj.material;
            obj.material = new MeshPhongMaterial({ shininess: 45 });
        }
    });
    scene.add(gltf.scene);
    clearScene();
});

function clearScene() {
    oldMaterial.dispose();
    renderer.renderLists.dispose();
}


// Tween kullanarak giriş kamerası animasyonu
// Intro camera animation using Tween
function introAnimation() {
    new TWEEN.Tween(camera.position.set(-0.4, -2, 2)).to({ x: 0, y: 2.2, z: 7 }, 4500).easing(TWEEN.Easing.Quadratic.InOut).start()
        .onComplete(function () {
            TWEEN.remove(this);
            document.querySelector('.header').classList.add('ended');
            document.querySelector('.first>p').classList.add('ended');
        });
}


// İkinci sahne için animasyonlu model yükleme fonksiyonu
// Model load function for second scene with animation
function loadModelWithAnimation(modelPath) {
    if (sceneSecond.children.length > 2) {
        const oldModel = sceneSecond.children[2];
        new TWEEN.Tween(oldModel.position)
            .to({ y: -20, x: -30 }, 1500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                sceneSecond.remove(oldModel);
                disposeModel(oldModel);
                loadNewModel(modelPath);
            })
            .start();
        new TWEEN.Tween(oldModel.rotation)
            .to({ z: Math.PI / 8 }, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
    } else {
        loadNewModel(modelPath);
    }
}

function loadNewModel(modelPath) {
    loader.load(modelPath, function (gltf) {
        const newModel = gltf.scene.clone();
        newModel.scale.set(2, 2, 2);
        newModel.position.set(10, 0, 0);
        newModel.rotation.set(0, Math.PI / 8, 0);
        newModel.traverse((child) => {
            if (child.isMesh) {
                child.material.transparent = true;
                child.material.opacity = 0;
            }
        });
        sceneSecond.add(newModel);
        new TWEEN.Tween(newModel.position)
            .to({ x: 0 }, 1200)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
        new TWEEN.Tween(newModel.rotation)
            .to({ y: 0, z: 0.5 }, 3500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
        newModel.traverse((child) => {
            if (child.isMesh) {
                new TWEEN.Tween(child.material)
                    .to({ opacity: 1 }, 1000)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .start();
            }
        });
        cameraSecond.position.set(-4, 5, 5);
        cameraSecond.lookAt(-4, 0, 0);
    }, undefined, function (error) {
        console.error('Model yükleme hatası:', error);
    });
}

function disposeModel(model) {
    model.traverse((child) => {
        if (child.isMesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach((mat) => mat.dispose());
                } else {
                    child.material.dispose();
                }
            }
        }
    });
}


// Butonlara tıklama olayları ile animasyonlu model değişimi
// Event listeners for button clicks with animated model change
document.getElementById('danismanlik').addEventListener('click', () => {
    document.getElementById('danismanlik').classList.add('active');
    document.getElementById('ceza').classList.remove('active');
    document.getElementById('sozlesme').classList.remove('active');
    document.getElementById('is').classList.remove('active');
    document.getElementById('tasinmaz').classList.remove('active');
    document.getElementById('content').innerHTML = 'Ofisimiz, çeşitli hukuk alanlarında müvekkillerimize kapsamlı hukuki danışmanlık hizmeti sunmaktadır. İş hukuku, taşınmaz hukuku, ceza hukuku ve sözleşmeler hukuku gibi birçok alanda uzman ekibimizle, müvekkillerimizin haklarını en iyi şekilde korumayı hedefliyoruz. Her müvekkilimizin ihtiyacına özel olarak sunduğumuz danışmanlık hizmetlerimizle, hukuki süreçlerin her aşamasında güvenilir ve profesyonel bir destek sağlıyoruz. Müvekkillerimize, davaların öncesi ve sonrasında hukuki risk analizi, süreç yönetimi ve müzakerelerde etkin çözümler sunarak, hukuki sorunların en hızlı ve etkili şekilde çözüme ulaşmasını amaçlıyoruz. Bu kapsamda, iş hukuku, taşınmaz hukuku, ceza hukuku ve sözleşmeler hukuku gibi birçok farklı alanda müvekkillerimizin ihtiyaçlarına yönelik özel çözümler sunuyoruz. İş hukuku kapsamında, işçi ve işveren arasındaki uyuşmazlıkların çözülmesi, kıdem ve ihbar tazminatı taleplerinin karşılanması, mobbing şikayetlerinin değerlendirilmesi ve fazla mesai alacakları gibi birçok konuda hukuki destek sağlıyoruz. Taşınmaz hukuku alanında ise gayrimenkul alım-satımı, kira sözleşmeleri, tapu işlemleri ve kentsel dönüşüm projelerinde hukuki danışmanlık sunarak, müvekkillerimizin mülkiyet haklarını koruma altına alıyoruz. Ceza hukuku alanında, ağır ceza davaları, suç isnatları, tutuklama ve gözaltı süreçlerinde müvekkillerimize en iyi savunmayı sağlıyoruz. Sözleşmeler hukuku kapsamında ise ticari ve bireysel sözleşmelerin hazırlanması, müzakere edilmesi ve uyuşmazlıkların çözülmesi gibi birçok konuda profesyonel hukuki danışmanlık hizmeti sunmaktayız.';
    loadModelWithAnimation('models/gltf/gavel.glb');  
});

document.getElementById('sozlesme').addEventListener('click', () => {
    document.getElementById('sozlesme').classList.add('active');
    document.getElementById('danismanlik').classList.remove('active');
    document.getElementById('ceza').classList.remove('active');
    document.getElementById('is').classList.remove('active');
    document.getElementById('tasinmaz').classList.remove('active');
    document.getElementById('content').innerHTML = 'Sözleşmeler hukuku, ticari ve bireysel işlemlerin hukuki güvence altına alınmasında önemli bir rol oynamaktadır. Ofisimiz, her türlü sözleşmenin hazırlanması, müzakere edilmesi ve sonrasında doğabilecek uyuşmazlıkların çözümü konusunda müvekkillerine profesyonel danışmanlık hizmeti sunmaktadır. Ticaret hukuku, kira, satış, iş ve hizmet sözleşmeleri gibi farklı türdeki sözleşmelerin hazırlanması sırasında, tarafların haklarının korunmasını sağlamak için hukuki destek sağlıyoruz. Müvekkillerimizin her birinin çıkarlarını en iyi şekilde korumak amacıyla sözleşmelerin hukuka uygun olarak hazırlanmasını ve taraflar arasında adil bir denge kurulmasını hedefliyoruz. Ticari sözleşmelerde, tarafların sorumluluklarını net bir şekilde belirleyerek, doğabilecek risklerin önüne geçmek için çalışıyoruz. Aynı zamanda kira sözleşmeleri, satış sözleşmeleri ve iş sözleşmeleri gibi özel hukuk ilişkilerini düzenleyen sözleşmelerde, taraflar arasındaki hukuki güvenliği sağlamak amacıyla detaylı çalışmalar yürütüyoruz. Uyuşmazlıkların çözümünde ise müvekkillerimize arabuluculuk ve alternatif çözüm yolları sunarak, davaların mahkemeye taşınmadan çözülmesine yardımcı oluyoruz. Sözleşmelerin ihlali durumunda, hukuki süreçlerin hızlı ve etkili bir şekilde yürütülmesi için dava yoluna gitmekteyiz. Özellikle ticari anlaşmazlıklar ve kira sözleşmelerinin ihlali gibi durumlarda, tarafların haklarını korumak için gerekli hukuki adımları atmaktayız.';
    loadModelWithAnimation('models/gltf/clipboard.glb');  
});

document.getElementById('ceza').addEventListener('click', () => {
    document.getElementById('ceza').classList.add('active');
    document.getElementById('danismanlik').classList.remove('active');
    document.getElementById('sozlesme').classList.remove('active');
    document.getElementById('is').classList.remove('active');
    document.getElementById('tasinmaz').classList.remove('active');
    document.getElementById('content').innerHTML = 'Ceza hukuku, bireylerin özgürlüğü ve haklarının korunmasında kritik bir role sahiptir. Ofisimiz, ağır ceza davalarından soruşturma süreçlerine, ceza indirim taleplerine kadar geniş bir spektrumda savunma hizmeti sunmaktadır. Bu süreçte müvekkillerimizin her türlü hukuki ihtiyacını karşılamak ve onlara en iyi savunma desteğini sağlamak için deneyimli avukatlarımızla birlikte çalışıyoruz. Suç isnat edilen durumlarda, ceza davalarında müvekkillerimizin haklarını korumak adına etkin ve stratejik savunma hizmetleri sunuyoruz. Bu kapsamda, her türlü cezai davada müvekkillerimize profesyonel hukuki destek vermekte ve suçsuzluk karinesi ilkesi çerçevesinde müvekkillerimizin haklarını sonuna kadar savunmaktayız. Ayrıca, dava öncesi ve dava sonrası süreçlerde hukuki danışmanlık sunarak, soruşturma ve kovuşturma süreçlerinde müvekkillerimizin haklarının korunması için gerekli adımları atmaktayız. Ceza hukuku kapsamında sunduğumuz hizmetler arasında; ağır ceza davaları, hırsızlık, dolandırıcılık, sahtecilik, uyuşturucu madde kullanımı ve ticareti, cinsel suçlar, adam öldürme, kasten yaralama gibi suçlarla ilgili davalar yer almaktadır. Müvekkillerimize yönelik suç isnatlarında, delil toplama, savunma hazırlama, tutuklama ve gözaltı süreçlerinde hukuki yardım sağlama gibi her türlü süreci titizlikle takip ediyoruz. Özellikle soruşturma aşamasında yapılan hataların telafisi mümkün olmayabilir. Bu yüzden, ofisimiz müvekkillerini bu aşamada en iyi şekilde temsil ederek, etkin savunma teknikleri ile müvekkil haklarını koruma altına almayı hedefler. Suç isnatlarının önüne geçmek ve delil karartma gibi olumsuz durumların engellenmesi için müvekkillerimize gerekli bilgilendirmeleri sağlıyoruz.';
    loadModelWithAnimation('models/gltf/scales3.glb');  
});

document.getElementById('is').addEventListener('click', () => {
    document.getElementById('is').classList.add('active');  
    document.getElementById('danismanlik').classList.remove('active');
    document.getElementById('sozlesme').classList.remove('active');
    document.getElementById('ceza').classList.remove('active');
    document.getElementById('tasinmaz').classList.remove('active');
    document.getElementById('content').innerHTML = 'İş hukuku, işçi ve işveren arasındaki hak ve yükümlülüklerin düzenlenmesini sağlayan bir hukuk dalıdır. Ofisimiz, işe iade davalarından kıdem ve ihbar tazminatı taleplerine, fazla mesai alacaklarından mobbing şikayetlerine kadar geniş bir yelpazede hizmet sunmaktadır. İş hukuku alanında müvekkillerimize sunduğumuz hizmetler, işçi haklarının korunması ve işverenlerin yasal yükümlülüklerini yerine getirmesi konusunda kapsamlı çözümler sunmayı amaçlar. İş hukuku kapsamındaki hizmetlerimiz, işçi alacaklarının tahsili, iş kazalarından doğan tazminat davaları, iş sözleşmelerinin hazırlanması ve feshi gibi konuları içermektedir. Müvekkillerimize bu süreçlerde, yasal haklarının korunması, iş yerinde yaşanan olumsuzlukların giderilmesi ve işverenle yaşanan uyuşmazlıkların çözümü konusunda destek sağlıyoruz. Özellikle mobbing (iş yerinde psikolojik taciz) vakalarında, işçilerin haklarını savunarak, hukuki yollarla bu tür kötü muamelelerin son bulmasını ve mağdur olan işçilerin haklarının geri alınmasını sağlıyoruz. Ayrıca, işe iade davaları ve iş akdinin haksız feshi durumlarında, işçilerin tekrar işe alınmaları veya tazminat haklarını alabilmeleri için gerekli hukuki süreci yönetiyoruz. İşverenler için de iş hukuku danışmanlığı hizmeti sunmaktayız. Bu kapsamda, iş sağlığı ve güvenliği tedbirlerinin alınması, iş sözleşmelerinin yasalara uygun olarak hazırlanması ve iş yerinde yaşanabilecek hukuki sorunların önüne geçilmesi adına işverenlere rehberlik ediyoruz. Ayrıca, iş yerinde toplu iş sözleşmeleri gibi önemli süreçlerde hukuki danışmanlık hizmeti sunarak, iş barışının korunmasına katkıda bulunuyoruz. Müvekkillerimize iş hukukuyla ilgili her türlü konuda rehberlik ediyor ve onların haklarını en iyi şekilde savunmak için hukuki bilgimizi ve tecrübemizi kullanıyoruz.';
    loadModelWithAnimation('models/gltf/helmet1.glb'); 
});

document.getElementById('tasinmaz').addEventListener('click', () => {
    document.getElementById('tasinmaz').classList.add('active');  
    document.getElementById('is').classList.remove('active');
    document.getElementById('danismanlik').classList.remove('active');
    document.getElementById('sozlesme').classList.remove('active');
    document.getElementById('ceza').classList.remove('active');
    document.getElementById('content').innerHTML = 'Taşınmaz hukuku, gayrimenkul alım-satımı, kira sözleşmeleri, tapu iptal ve tescil davaları gibi konuları kapsamaktadır. Ofisimiz, taşınmaz hukuku alanında müvekkillerimize kapsamlı danışmanlık ve hukuki temsil hizmetleri sunmaktadır. Gayrimenkul alım-satım sürecinde, müvekkillerimizin çıkarlarını en iyi şekilde koruyarak tapu işlemlerinin doğru ve güvenli bir şekilde yapılmasını sağlıyoruz. Kira sözleşmeleri konusunda hem kiracılar hem de mal sahipleri için hukuki danışmanlık sunarak, kira sözleşmesinin hazırlanması, uyarlanması ve tahliye süreçlerinde hukuki destek sağlıyoruz. Aynı zamanda, tapu iptal ve tescil davalarında, müvekkillerimizin mülkiyet haklarını korumak ve haksız yere yapılmış işlemlerin iptali için gerekli hukuki süreci yürütüyoruz. Kat karşılığı inşaat sözleşmeleri, ortaklığın giderilmesi davaları ve taşınmazların aynına ilişkin uyuşmazlıklar da taşınmaz hukuku kapsamında sunduğumuz hizmetler arasındadır. Özellikle kentsel dönüşüm projelerinde, müvekkillerimizin haklarını korumak adına hukuki danışmanlık ve temsil hizmeti sunarak, taşınmaz hukuku ile ilgili her türlü ihtilafta müvekkillerimize profesyonel destek sağlamaktayız. Bu süreçlerde, taraflar arasında oluşabilecek her türlü uyuşmazlığın çözüme kavuşturulması ve taşınmazların güvenli bir şekilde devri için gerekli hukuki işlemleri gerçekleştiriyoruz.';
    loadModelWithAnimation('models/gltf/key1.glb');  
});


// Render döngüsü işlevi, sürekli güncelleme ve sahne render işlemi yapar
// Render loop function for continuous updates and rendering scenes
function renderLoop() {
    TWEEN.update();
    renderer.render(scene, camera);
    rendererSecond.render(sceneSecond, cameraSecond);
    requestAnimationFrame(renderLoop);
}
renderLoop();


// Fare hareketiyle ışık pozisyonlarını değiştirme
// Configuring parallax effect to adjust light positions on mouse movement
document.addEventListener('mousemove', (event) => {
    const cursorX = event.clientX / window.innerWidth - 0.5;
    const cursorY = event.clientY / window.innerHeight - 0.5;

    if (secondContainer) {
        directionalLightSecond.position.x += (cursorX * 8 - directionalLightSecond.position.x) * 0.1;
        directionalLightSecond.position.y -= (cursorY * 8 + directionalLightSecond.position.y - 2) * 0.1;
    } else {
        sunLight.position.x += (cursorX * 8 - sunLight.position.x) * 0.1;
        sunLight.position.y -= (cursorY * 8 + sunLight.position.y - 2) * 0.1;
        fillLight.position.x += (cursorX * 8 - fillLight.position.x) * 0.1;
        fillLight.position.y -= (cursorY * 8 + fillLight.position.y - 2) * 0.1;
    }
});
// Modelin yüklenip yüklenmediğini takip eden bayrak
// Modelin yüklenip yüklenmediğini takip eden bayrak
let isModelLoaded = false; 
// LOADING MANAGER CALLBACK FOR WHEN ALL MODELS ARE LOADED
loadingManager.onLoad = function() {
    // Model yüklendiğinde yalnızca bir kez tetiklenen işlemler - Operations triggered only once when the model is loaded
    if (!isModelLoaded) { // Eğer model henüz yüklenmediyse - If the model is not yet installed
        document.querySelector(".main-container").style.visibility = 'visible';
        document.querySelector("body").style.overflow = 'auto';

        const yPosition = { y: 0 };
        new TWEEN.Tween(yPosition).to({ y: 200 }, 900).easing(TWEEN.Easing.Quadratic.InOut).start()
            .onUpdate(function () {
                loadingCover.style.setProperty('transform', `translate( 0, ${yPosition.y}%)`);
            })
            .onComplete(function () {
                if (document.getElementById("loading-text-intro")) {
                    loadingCover.parentNode.removeChild(document.getElementById("loading-text-intro"));
                }
                TWEEN.remove(this);
            });

        introAnimation();
        ftsLoader.parentNode.removeChild(ftsLoader);
        window.scroll(0, 0);
        
        // Bu işlemler sonrasında bayrağı güncelle - Update the flag after these operations
        isModelLoaded = true;
    }
};

// Sayfa yüklendiğinde model yükleme işlemi
// Model loading when the page is loaded
window.onload = () => {
    if (!isModelLoaded) { 
        document.getElementById('content').innerHTML = 'Ofisimiz, çeşitli hukuk alanlarında müvekkillerimize kapsamlı hukuki danışmanlık hizmeti sunmaktadır. İş hukuku, taşınmaz hukuku, ceza hukuku ve sözleşmeler hukuku gibi birçok alanda uzman ekibimizle, müvekkillerimizin haklarını en iyi şekilde korumayı hedefliyoruz. Her müvekkilimizin ihtiyacına özel olarak sunduğumuz danışmanlık hizmetlerimizle, hukuki süreçlerin her aşamasında güvenilir ve profesyonel bir destek sağlıyoruz. Müvekkillerimize, davaların öncesi ve sonrasında hukuki risk analizi, süreç yönetimi ve müzakerelerde etkin çözümler sunarak, hukuki sorunların en hızlı ve etkili şekilde çözüme ulaşmasını amaçlıyoruz. Bu kapsamda, iş hukuku, taşınmaz hukuku, ceza hukuku ve sözleşmeler hukuku gibi birçok farklı alanda müvekkillerimizin ihtiyaçlarına yönelik özel çözümler sunuyoruz. İş hukuku kapsamında, işçi ve işveren arasındaki uyuşmazlıkların çözülmesi, kıdem ve ihbar tazminatı taleplerinin karşılanması, mobbing şikayetlerinin değerlendirilmesi ve fazla mesai alacakları gibi birçok konuda hukuki destek sağlıyoruz. Taşınmaz hukuku alanında ise gayrimenkul alım-satımı, kira sözleşmeleri, tapu işlemleri ve kentsel dönüşüm projelerinde hukuki danışmanlık sunarak, müvekkillerimizin mülkiyet haklarını koruma altına alıyoruz. Ceza hukuku alanında, ağır ceza davaları, suç isnatları, tutuklama ve gözaltı süreçlerinde müvekkillerimize en iyi savunmayı sağlıyoruz. Sözleşmeler hukuku kapsamında ise ticari ve bireysel sözleşmelerin hazırlanması, müzakere edilmesi ve uyuşmazlıkların çözülmesi gibi birçok konuda profesyonel hukuki danışmanlık hizmeti sunmaktayız.';
        loadModelWithAnimation('models/gltf/gavel.glb');  
    }
};


// İletişim formunun gönderilmesi, yanıt mesajı gösterimi ve form temizleme işlemi
// Contact form submission, displaying response message, and clearing the form
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const responseMessage = document.getElementById('response-message');
    responseMessage.textContent = "Mesajınız iletildi.";
    responseMessage.style.display = "block";
    this.reset();
});

