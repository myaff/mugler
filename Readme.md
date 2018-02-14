Для запуска требуется gulp версии 4.0.0 или выше  
Туториал по обновлению https://www.liquidlight.co.uk/blog/article/how-do-i-update-to-gulp-4/

##Структура сборки
src  
--assets //содержит статичный файлы и папки, не подвергающиеся трансформации</span>  
----fonts  
--img  
--css  
----components  
----main.css  
--js  
----components  
----vendor  
----main.js  
--svg  
--jade  
----parts  
----components  
--data  
----data.json  

В результате сборки генерируется папка build и html-страницы в корне
build  
--assets // копия src/assets  
----fonts  
--img //сжатые изображения  
----svg /содержит svg-спрайт  
--css  
----main.css //скомпилированный css файл  
--js  
----vendor //копия src/js/vendor  
----main.js //выплевывается webpack`ом  
----svg-lib.js //содержит символы svg из src/svg  

##Таски
```gulp clean``` - удаление папки build  
```gulp build``` - сначала запускается clean, затем таски по сборке проекта  
```gulp webserver``` - запускает browsersync  
```gulp sassdoc``` - генерирует документацию к sass (аннотация http://sassdoc.com/annotations/)   
```gulp jsdoc``` - генерирует документацию к JS (аннотация http://usejsdoc.org/)  
и другие, детали в gulpfile.js  


##Режим разработки  
команда ```gulp```  
пересоздается папка build, запускается вотчер и вебсервер  


##Сборка для продакшена  
команда ```NODE_ENV=prod gulp```  
Пересоздается папка build  
В этом режиме не создается sourcemap, сжимается css  