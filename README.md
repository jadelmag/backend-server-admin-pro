# Backend Server 

## Descripción del proyecto
---

Servidor desarrollado en javascript usando el framework express, 
conectado a MongoDB usango Mongoose.

Para ejecutarlo, es necesario reconstruir los módulos de node usando el comando ***npm install*** y se levantará en el puerto 8080.

El proyecto ya viene preparado con las ***API KEYS de Google*** para realizar el login desde google, aunque también se puede autenticar de forma normal.

Además, es necesario tener instalado ***MongoDB*** levantado en el puerto 27017.

El repositorio cuenta con la documentación necesaria donde se explica como realizar las consultas mediante ***Postman***

https://documenter.getpostman.com/view/1151401/hospitaldb/7TGitkq

## Front End
---

El proyecto frontend de Angular que funciona perfectamente con este backend está en la siguiente dirección: 

* [AdminPro](https://github.com/jadelmag/adminpro)

## Instalación del proyecto
---

El proyecto require la instalación de [Node.js](https://nodejs.org/) v6+ para funcionar.

Instalar las dependencias y levantar el servidor.

```sh
$ npm install
```

### Dependencias

Las dependencias utilizadas para realizar este proyecto han sido las siguientes:

| Dependencia | Versión |
| ------ |  ------ |
| body-parser | 1.18.2 |
| express | 4.16.2 |
| express-fileupload | 0.3.0 |
| google-auth-library | 0.12.0 |
| jsonwebtoken | 8.1.0 |
| mongoose | 4.13.9 |
| mongoose-unique-validator | 1.0.6 |
| serve-index | 1.9.1 |

---

### Importante

El repositorio también cuenta con un mini proyecto, el cual es un servidor simple que se ha utilizado para realizar la autenticación con Google.

Este mini servidor de prueba se llama ''google-sigin-demo'' y se ha realizado con ***lite-server***, el cual se levanta en el puerto 4200.

---

Autor
---
* [Javier Delgado Magdalena](http://www.linkedin.com/pub/javier-delgado-magdalena/33/9a1/226)
