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

#### 用户登录

### 相册管理

#### 创建相册

#### 修改相册

#### 相册类别管理

### 图片管理

#### 上传图片

#### 浏览图片

### 评论管理

#### 发表评论
