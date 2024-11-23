# Memento - 一个简单的电子相册管理系统

## 系统设计目标

面向对象的电子相册系统旨在为用户提供一个集成照片管理、编辑和互动的数字化平台。用户能够通过系统上传、分类、浏览照片，并进行评论和互动。该系统将提供跨设备的无缝访问，并具有高效、用户友好的界面。

## 系统结构

```mermaid
classDiagram
direction BT
class Album
class AlbumController
class AlbumRepository {
<<Interface>>

}
class AlbumRequest
class AlbumService
class Comment
class CommentController
class CommentRepository {
<<Interface>>

}
class CommentService
class JwtAuthenticationFilter
class JwtUtil
class Photo
class PhotoAlbumApplication
class PhotoController
class PhotoRepository {
<<Interface>>

}
class PhotoRequest
class PhotoService
class RegisterRequest
class SecurityConfig
class User
class UserController
class UserRepository {
<<Interface>>

}
class UserService

Album "1" *--> "photos *" Photo 
Album "1" *--> "user 1" User 
AlbumController  ..>  Album : «create»
AlbumController "1" *--> "albumService 1" AlbumService 
AlbumController  ..>  User : «create»
AlbumService "1" *--> "albumRepository 1" AlbumRepository 
Comment "1" *--> "photo 1" Photo 
Comment "1" *--> "user 1" User 
CommentController "1" *--> "commentService 1" CommentService 
CommentService "1" *--> "commentRepository 1" CommentRepository 
JwtAuthenticationFilter "1" *--> "jwtUtil 1" JwtUtil 
Photo "1" *--> "album 1" Album 
Photo "1" *--> "comments *" Comment 
Photo "1" *--> "user 1" User 
PhotoController  ..>  Album : «create»
PhotoController  ..>  Photo : «create»
PhotoController "1" *--> "photoService 1" PhotoService 
PhotoService "1" *--> "photoRepository 1" PhotoRepository 
SecurityConfig  ..>  JwtAuthenticationFilter : «create»
SecurityConfig "1" *--> "jwtUtil 1" JwtUtil 
UserController "1" *--> "jwtUtil 1" JwtUtil 
UserController  ..>  User : «create»
UserController "1" *--> "userService 1" UserService 
UserService "1" *--> "userRepository 1" UserRepository 

```

## 功能设计

### 用户管理

#### 用户注册
![registerUser](static/imgs/UserController_registerUser.png)
```mermaid
sequenceDiagram
actor User
User ->> UserController : registerUser
activate UserController
UserController ->> User : new
activate User
User -->> UserController : #32; 
deactivate User
UserController ->> UserService : registerUser
activate UserService
UserService ->> UserRepository : existsByUsername
activate UserRepository
UserRepository -->> UserService : #32; 
deactivate UserRepository
UserService -->> UserController : #32; 
deactivate UserService
deactivate UserController
```

#### 用户登录
![loginUser](static/imgs/UserController_loginUser.png)
```mermaid
sequenceDiagram
actor User
User ->> UserController : loginUser
activate UserController
UserController ->> UserService : authenticateUser
activate UserService
UserService ->> UserService : findByUsername
activate UserService
UserService ->> UserRepository : findByUsername
activate UserRepository
UserRepository ->> UserService : () -&gt;
activate UserService
UserService -->> UserRepository : #32; 
deactivate UserService
UserRepository -->> UserService : #32; 
deactivate UserRepository
UserService -->> UserService : #32; 
deactivate UserService
UserService -->> UserController : #32; 
deactivate UserService
UserController ->> JwtUtil : generateToken
activate JwtUtil
JwtUtil -->> UserController : #32; 
deactivate JwtUtil
deactivate UserController
```

### 相册管理

#### 创建相册
![createAlbum](static/imgs/AlbumController_createAlbum.png)
```mermaid
sequenceDiagram
actor User
User ->> AlbumController : createAlbum
activate AlbumController
AlbumController ->> User : new
activate User
User -->> AlbumController : #32; 
deactivate User
AlbumController ->> Album : new
activate Album
Album -->> AlbumController : #32; 
deactivate Album
AlbumController ->> AlbumService : createAlbum
activate AlbumService
AlbumService -->> AlbumController : #32; 
deactivate AlbumService
deactivate AlbumController
```

#### 修改相册
![updateAlbum](static/imgs/AlbumController_updateAlbum.png)
```mermaid
sequenceDiagram
actor User
User ->> AlbumController : updateAlbum
activate AlbumController
AlbumController ->> AlbumService : updateAlbum
activate AlbumService
AlbumService -->> AlbumController : #32; 
deactivate AlbumService
deactivate AlbumController
```

#### 相册类别管理
![updateCategory](static/imgs/AlbumController_updateCategory.png)
```mermaid
sequenceDiagram
actor User
User ->> AlbumController : updateCategory
activate AlbumController
AlbumController ->> AlbumService : updateCategory
activate AlbumService
AlbumService -->> AlbumController : #32; 
deactivate AlbumService
deactivate AlbumController
```

### 图片管理

#### 上传图片
![uploadPhoto](static/imgs/PhotoController_uploadPhoto.png)
```mermaid
sequenceDiagram
actor User
User ->> PhotoController : uploadPhoto
activate PhotoController
PhotoController ->> PhotoService : uploadPhoto
activate PhotoService
PhotoService ->> PhotoService : uploadFileToNginx
activate PhotoService
PhotoService -->> PhotoService : #32; 
deactivate PhotoService
PhotoService -->> PhotoController : #32; 
deactivate PhotoService
PhotoController ->> Photo : new
activate Photo
Photo -->> PhotoController : #32; 
deactivate Photo
PhotoController ->> Album : new
activate Album
Album -->> PhotoController : #32; 
deactivate Album
PhotoController ->> PhotoService : savePhoto
activate PhotoService
PhotoService -->> PhotoController : #32; 
deactivate PhotoService
deactivate PhotoController
```

#### 浏览图片
![getPhoto](static/imgs/PhotoController_getPhoto.png)
```mermaid
sequenceDiagram
actor User
User ->> PhotoController : getPhoto
activate PhotoController
PhotoController ->> PhotoService : getPhoto
activate PhotoService
PhotoService -->> PhotoController : #32; 
deactivate PhotoService
deactivate PhotoController
```

### 评论管理

#### 发表评论
![addComment](static/imgs/CommentController_addComment.png)
```mermaid
sequenceDiagram
actor User
User ->> CommentController : addComment
activate CommentController
CommentController ->> CommentService : addComment
activate CommentService
CommentService -->> CommentController : #32; 
deactivate CommentService
deactivate CommentController
```

## 界面设计

## 非功能设计

## 数据库设计

### E-R图
```mermaid
classDiagram
direction BT
class albums {
   varchar(255) category
   varchar(255) description
   varchar(255) title
   bigint user_id
   bigint id
}
class comments {
   timestamp comment_time
   varchar(255) content
   bigint photo_id
   bigint user_id
   bigint id
}
class photos {
   varchar(255) description
   varchar(255) file_path
   varchar(255) title
   timestamp upload_time
   bigint album_id
   bigint id
}
class users {
   varchar(255) email
   boolean is_admin
   varchar(255) password
   varchar(255) username
   bigint id
}

albums  -->  users : user_id:id
comments  -->  photos : photo_id:id
comments  -->  users : user_id:id
photos  -->  albums : album_id:id
```

### 表设计


