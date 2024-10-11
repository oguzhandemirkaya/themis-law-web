import"./main.css";import{Clock,Scene,LoadingManager,WebGLRenderer,sRGBEncoding,Group,PerspectiveCamera,DirectionalLight,PointLight,MeshPhongMaterial}from"three";import{TWEEN}from"three/examples/jsm/libs/tween.module.min.js";import{DRACOLoader}from"three/examples/jsm/loaders/DRACOLoader.js";import{GLTFLoader}from"three/examples/jsm/loaders/GLTFLoader.js";import*as THREE from"three";const ftsLoader=document.querySelector(".lds-roller"),loadingCover=document.getElementById("loading-text-intro"),loadingManager=new LoadingManager;loadingManager.onLoad=function(){document.querySelector(".main-container").style.visibility="visible",document.querySelector("body").style.overflow="auto";const e={y:0};new TWEEN.Tween(e).to({y:200},900).easing(TWEEN.Easing.Quadratic.InOut).start().onUpdate((function(){loadingCover.style.setProperty("transform",`translate( 0, ${e.y}%)`)})).onComplete((function(){document.getElementById("loading-text-intro")&&loadingCover.parentNode.removeChild(document.getElementById("loading-text-intro")),TWEEN.remove(this)})),introAnimation(),ftsLoader.parentNode.removeChild(ftsLoader),window.scroll(0,0)};const dracoLoader=new DRACOLoader;dracoLoader.setDecoderPath("/draco/"),dracoLoader.setDecoderConfig({type:"js"});const loader=new GLTFLoader(loadingManager);loader.setDRACOLoader(dracoLoader);const container=document.getElementById("canvas-container"),containerDetails=document.getElementById("canvas-container-details");let oldMaterial,secondContainer=!1,width=container.clientWidth,height=container.clientHeight;const scene=new Scene,sceneSecond=new Scene,renderer=new WebGLRenderer({antialias:!0,alpha:!0,powerPreference:"high-performance"});renderer.autoClear=!0,renderer.setPixelRatio(Math.min(window.devicePixelRatio,1)),renderer.setSize(width,height),renderer.outputEncoding=sRGBEncoding,container.appendChild(renderer.domElement);const rendererSecond=new WebGLRenderer({antialias:!1});rendererSecond.setPixelRatio(Math.min(window.devicePixelRatio,1)),rendererSecond.setSize(width,height),rendererSecond.outputEncoding=sRGBEncoding,containerDetails.appendChild(rendererSecond.domElement);const cameraGroup=new Group;scene.add(cameraGroup);const camera=new PerspectiveCamera(35,width/height,1,100);camera.position.set(19,1.54,2),cameraGroup.add(camera);const cameraSecond=new PerspectiveCamera(50,containerDetails.clientWidth/containerDetails.clientHeight,1,100);cameraSecond.position.set(0,2,5),cameraSecond.lookAt(sceneSecond.position),sceneSecond.add(cameraSecond),window.addEventListener("resize",(()=>{camera.aspect=container.clientWidth/container.clientHeight,camera.updateProjectionMatrix(),cameraSecond.aspect=containerDetails.clientWidth/containerDetails.clientHeight,cameraSecond.updateProjectionMatrix(),renderer.setSize(container.clientWidth,container.clientHeight),rendererSecond.setSize(containerDetails.clientWidth,containerDetails.clientHeight),renderer.setPixelRatio(Math.min(window.devicePixelRatio,1)),rendererSecond.setPixelRatio(Math.min(window.devicePixelRatio,1))}));const sunLight=new DirectionalLight(4414578,.08);sunLight.position.set(-100,0,-100),scene.add(sunLight);const fillLight=new PointLight(8958681,2.7,4,3);fillLight.position.set(30,3,1.8),scene.add(fillLight);const directionalLightSecond=new DirectionalLight(16777215,2);directionalLightSecond.position.set(10,10,10),sceneSecond.add(directionalLightSecond);const ambientLightSecond=new THREE.AmbientLight(16777215,1);function clearScene(){oldMaterial.dispose(),renderer.renderLists.dispose()}function introAnimation(){new TWEEN.Tween(camera.position.set(-.4,-2,2)).to({x:0,y:2.2,z:7},4500).easing(TWEEN.Easing.Quadratic.InOut).start().onComplete((function(){TWEEN.remove(this),document.querySelector(".header").classList.add("ended"),document.querySelector(".first>p").classList.add("ended")}))}function loadModelWithAnimation(e){if(sceneSecond.children.length>2){const a=sceneSecond.children[2];new TWEEN.Tween(a.position).to({y:-20,x:-30},1500).easing(TWEEN.Easing.Quadratic.InOut).onComplete((()=>{sceneSecond.remove(a),disposeModel(a),loadNewModel(e)})).start(),new TWEEN.Tween(a.rotation).to({z:Math.PI/8},1e3).easing(TWEEN.Easing.Quadratic.InOut).start()}else loadNewModel(e)}function loadNewModel(e){loader.load(e,(function(e){const a=e.scene.clone();a.scale.set(2,2,2),a.position.set(10,0,0),a.rotation.set(0,Math.PI/8,0),a.traverse((e=>{e.isMesh&&(e.material.transparent=!0,e.material.opacity=0)})),sceneSecond.add(a),new TWEEN.Tween(a.position).to({x:0},1200).easing(TWEEN.Easing.Quadratic.InOut).start(),new TWEEN.Tween(a.rotation).to({y:0,z:.5},3500).easing(TWEEN.Easing.Quadratic.InOut).start(),a.traverse((e=>{e.isMesh&&new TWEEN.Tween(e.material).to({opacity:1},1e3).easing(TWEEN.Easing.Quadratic.InOut).start()})),cameraSecond.position.set(-4,5,5),cameraSecond.lookAt(-4,0,0)}),void 0,(function(e){console.error("Model yükleme hatası:",e)}))}function disposeModel(e){e.traverse((e=>{e.isMesh&&(e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach((e=>e.dispose())):e.material.dispose()))}))}function renderLoop(){TWEEN.update(),renderer.render(scene,camera),rendererSecond.render(sceneSecond,cameraSecond),requestAnimationFrame(renderLoop)}sceneSecond.add(ambientLightSecond),loader.load("models/gltf/themis.glb",(function(e){e.scene.traverse((e=>{e.isMesh&&(oldMaterial=e.material,e.material=new MeshPhongMaterial({shininess:45}))})),scene.add(e.scene),clearScene()})),document.getElementById("danismanlik").addEventListener("click",(()=>{document.getElementById("danismanlik").classList.add("active"),document.getElementById("ceza").classList.remove("active"),document.getElementById("sozlesme").classList.remove("active"),document.getElementById("is").classList.remove("active"),document.getElementById("tasinmaz").classList.remove("active"),document.getElementById("content").innerHTML="Ofisimiz, çeşitli hukuk alanlarında müvekkillerimize kapsamlı hukuki danışmanlık hizmeti sunmaktadır. İş hukuku, taşınmaz hukuku, ceza hukuku ve sözleşmeler hukuku gibi birçok alanda uzman ekibimizle, müvekkillerimizin haklarını en iyi şekilde korumayı hedefliyoruz. Her müvekkilimizin ihtiyacına özel olarak sunduğumuz danışmanlık hizmetlerimizle, hukuki süreçlerin her aşamasında güvenilir ve profesyonel bir destek sağlıyoruz. Müvekkillerimize, davaların öncesi ve sonrasında hukuki risk analizi, süreç yönetimi ve müzakerelerde etkin çözümler sunarak, hukuki sorunların en hızlı ve etkili şekilde çözüme ulaşmasını amaçlıyoruz. Bu kapsamda, iş hukuku, taşınmaz hukuku, ceza hukuku ve sözleşmeler hukuku gibi birçok farklı alanda müvekkillerimizin ihtiyaçlarına yönelik özel çözümler sunuyoruz. İş hukuku kapsamında, işçi ve işveren arasındaki uyuşmazlıkların çözülmesi, kıdem ve ihbar tazminatı taleplerinin karşılanması, mobbing şikayetlerinin değerlendirilmesi ve fazla mesai alacakları gibi birçok konuda hukuki destek sağlıyoruz. Taşınmaz hukuku alanında ise gayrimenkul alım-satımı, kira sözleşmeleri, tapu işlemleri ve kentsel dönüşüm projelerinde hukuki danışmanlık sunarak, müvekkillerimizin mülkiyet haklarını koruma altına alıyoruz. Ceza hukuku alanında, ağır ceza davaları, suç isnatları, tutuklama ve gözaltı süreçlerinde müvekkillerimize en iyi savunmayı sağlıyoruz. Sözleşmeler hukuku kapsamında ise ticari ve bireysel sözleşmelerin hazırlanması, müzakere edilmesi ve uyuşmazlıkların çözülmesi gibi birçok konuda profesyonel hukuki danışmanlık hizmeti sunmaktayız.",loadModelWithAnimation("models/gltf/gavel.glb")})),document.getElementById("sozlesme").addEventListener("click",(()=>{document.getElementById("sozlesme").classList.add("active"),document.getElementById("danismanlik").classList.remove("active"),document.getElementById("ceza").classList.remove("active"),document.getElementById("is").classList.remove("active"),document.getElementById("tasinmaz").classList.remove("active"),document.getElementById("content").innerHTML="Sözleşmeler hukuku, ticari ve bireysel işlemlerin hukuki güvence altına alınmasında önemli bir rol oynamaktadır. Ofisimiz, her türlü sözleşmenin hazırlanması, müzakere edilmesi ve sonrasında doğabilecek uyuşmazlıkların çözümü konusunda müvekkillerine profesyonel danışmanlık hizmeti sunmaktadır. Ticaret hukuku, kira, satış, iş ve hizmet sözleşmeleri gibi farklı türdeki sözleşmelerin hazırlanması sırasında, tarafların haklarının korunmasını sağlamak için hukuki destek sağlıyoruz. Müvekkillerimizin her birinin çıkarlarını en iyi şekilde korumak amacıyla sözleşmelerin hukuka uygun olarak hazırlanmasını ve taraflar arasında adil bir denge kurulmasını hedefliyoruz. Ticari sözleşmelerde, tarafların sorumluluklarını net bir şekilde belirleyerek, doğabilecek risklerin önüne geçmek için çalışıyoruz. Aynı zamanda kira sözleşmeleri, satış sözleşmeleri ve iş sözleşmeleri gibi özel hukuk ilişkilerini düzenleyen sözleşmelerde, taraflar arasındaki hukuki güvenliği sağlamak amacıyla detaylı çalışmalar yürütüyoruz. Uyuşmazlıkların çözümünde ise müvekkillerimize arabuluculuk ve alternatif çözüm yolları sunarak, davaların mahkemeye taşınmadan çözülmesine yardımcı oluyoruz. Sözleşmelerin ihlali durumunda, hukuki süreçlerin hızlı ve etkili bir şekilde yürütülmesi için dava yoluna gitmekteyiz. Özellikle ticari anlaşmazlıklar ve kira sözleşmelerinin ihlali gibi durumlarda, tarafların haklarını korumak için gerekli hukuki adımları atmaktayız.",loadModelWithAnimation("models/gltf/clipboard.glb")})),document.getElementById("ceza").addEventListener("click",(()=>{document.getElementById("ceza").classList.add("active"),document.getElementById("danismanlik").classList.remove("active"),document.getElementById("sozlesme").classList.remove("active"),document.getElementById("is").classList.remove("active"),document.getElementById("tasinmaz").classList.remove("active"),document.getElementById("content").innerHTML="Ceza hukuku, bireylerin özgürlüğü ve haklarının korunmasında kritik bir role sahiptir. Ofisimiz, ağır ceza davalarından soruşturma süreçlerine, ceza indirim taleplerine kadar geniş bir spektrumda savunma hizmeti sunmaktadır. Bu süreçte müvekkillerimizin her türlü hukuki ihtiyacını karşılamak ve onlara en iyi savunma desteğini sağlamak için deneyimli avukatlarımızla birlikte çalışıyoruz. Suç isnat edilen durumlarda, ceza davalarında müvekkillerimizin haklarını korumak adına etkin ve stratejik savunma hizmetleri sunuyoruz. Bu kapsamda, her türlü cezai davada müvekkillerimize profesyonel hukuki destek vermekte ve suçsuzluk karinesi ilkesi çerçevesinde müvekkillerimizin haklarını sonuna kadar savunmaktayız. Ayrıca, dava öncesi ve dava sonrası süreçlerde hukuki danışmanlık sunarak, soruşturma ve kovuşturma süreçlerinde müvekkillerimizin haklarının korunması için gerekli adımları atmaktayız. Ceza hukuku kapsamında sunduğumuz hizmetler arasında; ağır ceza davaları, hırsızlık, dolandırıcılık, sahtecilik, uyuşturucu madde kullanımı ve ticareti, cinsel suçlar, adam öldürme, kasten yaralama gibi suçlarla ilgili davalar yer almaktadır. Müvekkillerimize yönelik suç isnatlarında, delil toplama, savunma hazırlama, tutuklama ve gözaltı süreçlerinde hukuki yardım sağlama gibi her türlü süreci titizlikle takip ediyoruz. Özellikle soruşturma aşamasında yapılan hataların telafisi mümkün olmayabilir. Bu yüzden, ofisimiz müvekkillerini bu aşamada en iyi şekilde temsil ederek, etkin savunma teknikleri ile müvekkil haklarını koruma altına almayı hedefler. Suç isnatlarının önüne geçmek ve delil karartma gibi olumsuz durumların engellenmesi için müvekkillerimize gerekli bilgilendirmeleri sağlıyoruz.",loadModelWithAnimation("models/gltf/scales3.glb")})),document.getElementById("is").addEventListener("click",(()=>{document.getElementById("is").classList.add("active"),document.getElementById("danismanlik").classList.remove("active"),document.getElementById("sozlesme").classList.remove("active"),document.getElementById("ceza").classList.remove("active"),document.getElementById("tasinmaz").classList.remove("active"),document.getElementById("content").innerHTML="İş hukuku, işçi ve işveren arasındaki hak ve yükümlülüklerin düzenlenmesini sağlayan bir hukuk dalıdır. Ofisimiz, işe iade davalarından kıdem ve ihbar tazminatı taleplerine, fazla mesai alacaklarından mobbing şikayetlerine kadar geniş bir yelpazede hizmet sunmaktadır. İş hukuku alanında müvekkillerimize sunduğumuz hizmetler, işçi haklarının korunması ve işverenlerin yasal yükümlülüklerini yerine getirmesi konusunda kapsamlı çözümler sunmayı amaçlar. İş hukuku kapsamındaki hizmetlerimiz, işçi alacaklarının tahsili, iş kazalarından doğan tazminat davaları, iş sözleşmelerinin hazırlanması ve feshi gibi konuları içermektedir. Müvekkillerimize bu süreçlerde, yasal haklarının korunması, iş yerinde yaşanan olumsuzlukların giderilmesi ve işverenle yaşanan uyuşmazlıkların çözümü konusunda destek sağlıyoruz. Özellikle mobbing (iş yerinde psikolojik taciz) vakalarında, işçilerin haklarını savunarak, hukuki yollarla bu tür kötü muamelelerin son bulmasını ve mağdur olan işçilerin haklarının geri alınmasını sağlıyoruz. Ayrıca, işe iade davaları ve iş akdinin haksız feshi durumlarında, işçilerin tekrar işe alınmaları veya tazminat haklarını alabilmeleri için gerekli hukuki süreci yönetiyoruz. İşverenler için de iş hukuku danışmanlığı hizmeti sunmaktayız. Bu kapsamda, iş sağlığı ve güvenliği tedbirlerinin alınması, iş sözleşmelerinin yasalara uygun olarak hazırlanması ve iş yerinde yaşanabilecek hukuki sorunların önüne geçilmesi adına işverenlere rehberlik ediyoruz. Ayrıca, iş yerinde toplu iş sözleşmeleri gibi önemli süreçlerde hukuki danışmanlık hizmeti sunarak, iş barışının korunmasına katkıda bulunuyoruz. Müvekkillerimize iş hukukuyla ilgili her türlü konuda rehberlik ediyor ve onların haklarını en iyi şekilde savunmak için hukuki bilgimizi ve tecrübemizi kullanıyoruz.",loadModelWithAnimation("models/gltf/helmet1.glb")})),document.getElementById("tasinmaz").addEventListener("click",(()=>{document.getElementById("tasinmaz").classList.add("active"),document.getElementById("is").classList.remove("active"),document.getElementById("danismanlik").classList.remove("active"),document.getElementById("sozlesme").classList.remove("active"),document.getElementById("ceza").classList.remove("active"),document.getElementById("content").innerHTML="Taşınmaz hukuku, gayrimenkul alım-satımı, kira sözleşmeleri, tapu iptal ve tescil davaları gibi konuları kapsamaktadır. Ofisimiz, taşınmaz hukuku alanında müvekkillerimize kapsamlı danışmanlık ve hukuki temsil hizmetleri sunmaktadır. Gayrimenkul alım-satım sürecinde, müvekkillerimizin çıkarlarını en iyi şekilde koruyarak tapu işlemlerinin doğru ve güvenli bir şekilde yapılmasını sağlıyoruz. Kira sözleşmeleri konusunda hem kiracılar hem de mal sahipleri için hukuki danışmanlık sunarak, kira sözleşmesinin hazırlanması, uyarlanması ve tahliye süreçlerinde hukuki destek sağlıyoruz. Aynı zamanda, tapu iptal ve tescil davalarında, müvekkillerimizin mülkiyet haklarını korumak ve haksız yere yapılmış işlemlerin iptali için gerekli hukuki süreci yürütüyoruz. Kat karşılığı inşaat sözleşmeleri, ortaklığın giderilmesi davaları ve taşınmazların aynına ilişkin uyuşmazlıklar da taşınmaz hukuku kapsamında sunduğumuz hizmetler arasındadır. Özellikle kentsel dönüşüm projelerinde, müvekkillerimizin haklarını korumak adına hukuki danışmanlık ve temsil hizmeti sunarak, taşınmaz hukuku ile ilgili her türlü ihtilafta müvekkillerimize profesyonel destek sağlamaktayız. Bu süreçlerde, taraflar arasında oluşabilecek her türlü uyuşmazlığın çözüme kavuşturulması ve taşınmazların güvenli bir şekilde devri için gerekli hukuki işlemleri gerçekleştiriyoruz.",loadModelWithAnimation("models/gltf/key1.glb")})),renderLoop(),document.addEventListener("mousemove",(e=>{const a=e.clientX/window.innerWidth-.5,i=e.clientY/window.innerHeight-.5;secondContainer?(directionalLightSecond.position.x+=.1*(8*a-directionalLightSecond.position.x),directionalLightSecond.position.y-=.1*(8*i+directionalLightSecond.position.y-2)):(sunLight.position.x+=.1*(8*a-sunLight.position.x),sunLight.position.y-=.1*(8*i+sunLight.position.y-2),fillLight.position.x+=.1*(8*a-fillLight.position.x),fillLight.position.y-=.1*(8*i+fillLight.position.y-2))}));let isModelLoaded=!1;loadingManager.onLoad=function(){if(!isModelLoaded){document.querySelector(".main-container").style.visibility="visible",document.querySelector("body").style.overflow="auto";const e={y:0};new TWEEN.Tween(e).to({y:200},900).easing(TWEEN.Easing.Quadratic.InOut).start().onUpdate((function(){loadingCover.style.setProperty("transform",`translate( 0, ${e.y}%)`)})).onComplete((function(){document.getElementById("loading-text-intro")&&loadingCover.parentNode.removeChild(document.getElementById("loading-text-intro")),TWEEN.remove(this)})),introAnimation(),ftsLoader.parentNode.removeChild(ftsLoader),window.scroll(0,0),isModelLoaded=!0}},window.onload=()=>{isModelLoaded||(document.getElementById("content").innerHTML="Ofisimiz, çeşitli hukuk alanlarında müvekkillerimize kapsamlı hukuki danışmanlık hizmeti sunmaktadır. İş hukuku, taşınmaz hukuku, ceza hukuku ve sözleşmeler hukuku gibi birçok alanda uzman ekibimizle, müvekkillerimizin haklarını en iyi şekilde korumayı hedefliyoruz. Her müvekkilimizin ihtiyacına özel olarak sunduğumuz danışmanlık hizmetlerimizle, hukuki süreçlerin her aşamasında güvenilir ve profesyonel bir destek sağlıyoruz. Müvekkillerimize, davaların öncesi ve sonrasında hukuki risk analizi, süreç yönetimi ve müzakerelerde etkin çözümler sunarak, hukuki sorunların en hızlı ve etkili şekilde çözüme ulaşmasını amaçlıyoruz. Bu kapsamda, iş hukuku, taşınmaz hukuku, ceza hukuku ve sözleşmeler hukuku gibi birçok farklı alanda müvekkillerimizin ihtiyaçlarına yönelik özel çözümler sunuyoruz. İş hukuku kapsamında, işçi ve işveren arasındaki uyuşmazlıkların çözülmesi, kıdem ve ihbar tazminatı taleplerinin karşılanması, mobbing şikayetlerinin değerlendirilmesi ve fazla mesai alacakları gibi birçok konuda hukuki destek sağlıyoruz. Taşınmaz hukuku alanında ise gayrimenkul alım-satımı, kira sözleşmeleri, tapu işlemleri ve kentsel dönüşüm projelerinde hukuki danışmanlık sunarak, müvekkillerimizin mülkiyet haklarını koruma altına alıyoruz. Ceza hukuku alanında, ağır ceza davaları, suç isnatları, tutuklama ve gözaltı süreçlerinde müvekkillerimize en iyi savunmayı sağlıyoruz. Sözleşmeler hukuku kapsamında ise ticari ve bireysel sözleşmelerin hazırlanması, müzakere edilmesi ve uyuşmazlıkların çözülmesi gibi birçok konuda profesyonel hukuki danışmanlık hizmeti sunmaktayız.",loadModelWithAnimation("models/gltf/gavel.glb"))},document.getElementById("contact-form").addEventListener("submit",(function(e){e.preventDefault();const a=document.getElementById("response-message");a.textContent="Mesajınız iletildi.",a.style.display="block",this.reset()}));