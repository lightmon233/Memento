# Memento - 一个简单的电子相册管理系统

## 系统设计目标

面向对象的电子相册系统旨在为用户提供一个集成照片管理、编辑和互动的数字化平台。用户能够通过系统上传、分类、浏览照片，并进行评论和互动。该系统将提供跨设备的无缝访问，并具有高效、用户友好的界面。

## 系统结构
![class](static/imgs/class.png)
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

```mermaid
classDiagram
direction BT
class User {
  + User() 
  - String username
  - String password
  - String email
  - LocalDateTime createdAt
  - Long id
  - boolean isAdmin
  # canEqual(Object) boolean
  + toString() String
  + hashCode() int
  + equals(Object) boolean
  # onCreate() void
   String password
   LocalDateTime createdAt
   Long id
   String email
   boolean isAdmin
   String username
   String role
}
class UserController {
  + UserController() 
  + registerUser(RegisterRequest) ResponseEntity~?~
  + loginUser(User) ResponseEntity~?~
}
class UserService {
  + UserService() 
  + registerUser(User) User
  + authenticateUser(String, String) User
  + findByUsername(String) User
}
class UserRepository {
<<Interface>>
  + findByUsername(String) Optional~User~
  + existsByUsername(String) boolean
}
class RegisterRequest {
  + RegisterRequest() 
  - String email
  - String confirmPassword
  - String password
  - String username
  + toString() String
  + equals(Object) boolean
  # canEqual(Object) boolean
  + hashCode() int
   String password
   String username
   String email
   String confirmPassword
}
class JwtUtil {
  + JwtUtil() 
  + extractUserId(String) Long
  + extractRole(String) String
  + validateToken(String) boolean
  + extractUsername(String) String
  + generateToken(User) String
  + extractAllClaims(String) Claims
  + extractCreatedAt(String) String
}
UserController --> UserService : "使用"
UserService --> UserRepository : "调用"
UserController --> JwtUtil : "使用"
UserService --> RegisterRequest : "处理"
UserController --> RegisterRequest : "接收"
UserController --> UserRepository : "使用"
UserService --> JwtUtil : "使用"

```

#### 用户注册&登录

```mermaid
sequenceDiagram
    actor User as :User
    participant UserInterface as :UserInterface
    participant UserController as :UserController
    participant UserService as :UserService
    participant UserRepository as :UserRepository
    participant JwtUtil as :JwtUtil
    User->>UserInterface: 1: Initiate registration/login
    activate User
    activate UserInterface
    UserInterface->>UserController: 2: registerUser(RegisterRequest)
    activate UserController
    UserController->>UserService: 3: registerUser(User)
    activate UserService
    UserService->>UserRepository: 4: save(User)
    activate UserRepository
    UserRepository-->>UserService: 5: User saved
    deactivate UserRepository
    UserService->>JwtUtil: 6: generateToken(User)
    activate JwtUtil
    JwtUtil-->>UserService: 7: JWT Token
    deactivate JwtUtil
    UserService-->>UserController: 8: User object with token
    deactivate UserService
    UserController-->>UserInterface: 9: Response: User details with token
    deactivate UserController
    UserInterface-->>User: 10: Display user info and token
    deactivate UserInterface
    deactivate User
    User->>UserInterface: 11: Initiate login
    activate User
    activate UserInterface
    UserInterface->>UserController: 12: loginUser(User)
    activate UserController
    UserController->>UserService: 13: authenticateUser(username, password)
    activate UserService
    UserService->>UserRepository: 14: findByUsername(username)
    activate UserRepository
    UserRepository-->>UserService: 15: User data
    deactivate UserRepository
    UserService-->>UserController: 16: User object
    deactivate UserService
    UserController->>JwtUtil: 17: generateToken(User)
    activate JwtUtil
    JwtUtil-->>UserController: 18: JWT Token
    deactivate JwtUtil
    UserController-->>UserInterface: 19: Response: Authenticated user with token
    deactivate UserController
    UserInterface-->>User: 20: Display authenticated user info and token
    deactivate UserInterface
    deactivate User
```



### 相册管理

```mermaid
classDiagram
   class Album {
  + Album() 
  - String category
  - LocalDateTime updatedAt
  - String title
  - Long id
  - List~Photo~ photos
  - String description
  - User user
  - LocalDateTime createdAt
  # canEqual(Object) boolean
  + toString() String
  + equals(Object) boolean
  + hashCode() int
    String description
       LocalDateTime updatedAt
       LocalDateTime createdAt
       String title
       Long id
       List~Photo~ photos
       String category
       User user
    }
    class AlbumController {
  + AlbumController() 
  + createAlbum(AlbumRequest) ResponseEntity~?~
  + getUserAlbums(Long) ResponseEntity~?~
  + updateCategory(String, String) ResponseEntity~?~
  + updateAlbum(Long, Album) ResponseEntity~?~
  + getAlbumsByCategory(String) ResponseEntity~?~
  + addCategory(String) ResponseEntity~?~
  + deleteCategory(String) ResponseEntity~?~
    ResponseEntity~?~ allAlbums
    }
    class AlbumRepository {
    <<Interface>>
  + findByUserId(Long) List~Album~
  + findByCategory(String) List~Album~
    }
    class AlbumRequest {
  + AlbumRequest() 
  - String category
  - String description
  - Long userId
  - String title
  + toString() String
  + equals(Object) boolean
  # canEqual(Object) boolean
  + hashCode() int
    String description
       Long userId
       String title
       String category
    }
    class AlbumService {
  + AlbumService() 
  + getAlbumsByCategory(String) List~Album~
  + getUserAlbums(Long) List~Album~
  + addCategory(String) void
  + createAlbum(Album) Album
  + updateCategory(String, String) void
  + deleteCategory(String) void
  + updateAlbum(Album) Album
    List~Album~ allAlbums
    }
Album --> Photo : "包含"
Album --> User : "属于"
AlbumController  ..>  Album : "创建"
AlbumController --> AlbumService : "使用"
AlbumController  ..>  User : "创建"
AlbumService --> AlbumRepository : "使用"
```



#### 创建相册

```mermaid
sequenceDiagram
    actor User
    participant AlbumInterface
    participant AlbumController
    participant AlbumService
    participant AlbumRepository
    
    User ->> AlbumInterface: 1: createAlbumRequest
    activate User
    activate AlbumInterface
    
    AlbumInterface ->> AlbumController: 2: createAlbum(albumRequest)
    activate AlbumController
    
    AlbumController ->> AlbumService: 3: createAlbum(albumRequest)
    activate AlbumService
    
    AlbumService ->> AlbumService: 4: validateRequest()
    
    AlbumService ->> Album: 5: new Album()
    activate Album
    Album -->> AlbumService: 6: album object
    deactivate Album
    
    AlbumService ->> AlbumRepository: 7: save(album)
    activate AlbumRepository
    AlbumRepository -->> AlbumService: 8: saved album
    deactivate AlbumRepository
    
    AlbumService -->> AlbumController: 9: album object
    deactivate AlbumService
    
    AlbumController -->> AlbumInterface: 10: Response with album details
    deactivate AlbumController
    
    AlbumInterface -->> User: 11: Success response
    deactivate AlbumInterface
    deactivate User
```

#### 修改相册

```mermaid
sequenceDiagram
    actor User
    participant AlbumInterface
    participant AlbumController
    participant AlbumService
    participant AlbumRepository
    
    User ->> AlbumInterface: 1: updateAlbumRequest
    activate User
    activate AlbumInterface
    
    AlbumInterface ->> AlbumController: 2: updateAlbum(albumRequest)
    activate AlbumController
    
    AlbumController ->> AlbumService: 3: updateAlbum(albumRequest)
    activate AlbumService
    
    AlbumService ->> AlbumService: 4: validateRequest()
    
    AlbumService ->> AlbumRepository: 5: findById(albumId)
    activate AlbumRepository
    AlbumRepository -->> AlbumService: 6: existing album
    deactivate AlbumRepository
    
    AlbumService ->> AlbumService: 7: updateAlbumFields()
    
    AlbumService ->> AlbumRepository: 8: save(updatedAlbum)
    activate AlbumRepository
    AlbumRepository -->> AlbumService: 9: saved album
    deactivate AlbumRepository
    
    AlbumService -->> AlbumController: 10: updated album
    deactivate AlbumService
    
    AlbumController -->> AlbumInterface: 11: Response with updated album
    deactivate AlbumController
    
    AlbumInterface -->> User: 12: Success response
    deactivate AlbumInterface
    deactivate User

```

#### 相册类别管理

```mermaid
sequenceDiagram
    actor User
    participant AlbumInterface
    participant AlbumController
    participant AlbumService
    participant AlbumRepository
    
    User ->> AlbumInterface: 1: updateCategoryRequest
    activate User
    activate AlbumInterface
    
    AlbumInterface ->> AlbumController: 2: updateCategory(oldCategory, newCategory)
    activate AlbumController
    
    AlbumController ->> AlbumService: 3: updateCategory(oldCategory, newCategory)
    activate AlbumService
    
    AlbumService ->> AlbumService: 4: validateCategories()
    
    AlbumService ->> AlbumRepository: 5: findByCategory(oldCategory)
    activate AlbumRepository
    AlbumRepository -->> AlbumService: 6: albums list
    deactivate AlbumRepository
    
    AlbumService ->> AlbumService: 7: updateAlbumsCategory()
    
    AlbumService ->> AlbumRepository: 8: saveAll(updatedAlbums)
    activate AlbumRepository
    AlbumRepository -->> AlbumService: 9: saved albums
    deactivate AlbumRepository
    
    AlbumService -->> AlbumController: 10: update result
    deactivate AlbumService
    
    AlbumController -->> AlbumInterface: 11: Response with update status
    deactivate AlbumController
    
    AlbumInterface -->> User: 12: Success response
    deactivate AlbumInterface
    deactivate User

```

### 图片管理

```mermaid
classDiagram
    %% Photo模块的依赖关系和继承外部模块的关系
    %% PhotoController类
    class PhotoController {
        +getPhoto(id: Long): ResponseEntity<Photo>
        +getPhotosByAlbum(albumId: Long): ResponseEntity<List<Photo>>
        +uploadPhoto(file: MultipartFile): ResponseEntity<Photo>
    }
    PhotoController --> PhotoService : "使用"
    PhotoController --> ResponseEntity : "返回"
    %% PhotoService类
    class PhotoService {
        +getPhoto(id: Long): Photo
        +getPhotosByAlbum(albumId: Long): List<Photo>
        +uploadPhoto(file: MultipartFile): Photo
    }
    PhotoService --> PhotoRepository : "使用"
    PhotoService --> Photo : "操作"
    %% Photo类
    class Photo {
        -id: Long
        -title: String
        -description: String
        -url: String
        -createdAt: LocalDateTime
        -updatedAt: LocalDateTime
        -isPublic: Boolean
    }
    Photo --> Album : "属于"
    Photo --> User : "属于"
    Photo --> Comment : "包含"
    %% 外部模块关系
    class PhotoRepository {
        +findByAlbumId(albumId: Long): List<Photo>
        +findById(id: Long): Optional<Photo>
        +save(photo: Photo): Photo
    }
    PhotoService --> PhotoRepository : "使用"
    
    class Album {
        -id: Long
        -title: String
        -description: String
        -photos: List<Photo>
    }
    Photo --> Album : "属于"
    class User {
        -id: Long
        -username: String
        -email: String
        -photos: List<Photo>
    }
    Photo --> User : "属于"
    class Comment {
        -id: Long
        -content: String
        -photo: Photo
        -createdAt: LocalDateTime
    }
Photo --> Comment : "包含"

```



#### 上传图片

```mermaid
sequenceDiagram
    actor User as :User
    participant PhotoInterface as :PhotoInterface
    participant PhotoController as :PhotoController
    participant PhotoService as :PhotoService
    participant PhotoRepository as :PhotoRepository
    participant Album as :Album

    User->>PhotoInterface: 1: uploadPhoto(file, albumId)
    activate User
    activate PhotoInterface

    PhotoInterface->>PhotoController: 2: uploadPhoto(file, albumId)
    activate PhotoController

    PhotoController->>PhotoService: 3: uploadPhoto(file, albumId)
    activate PhotoService

    PhotoService->>PhotoService: 4: validatePhoto(file)

    PhotoService->>Album: 5: findAlbumById(albumId)
    activate Album
    Album-->>PhotoService: 5.1: album object
    deactivate Album

    PhotoService->>PhotoService: 6: uploadFileToNginx(file)
    PhotoService->>PhotoService: 7: createPhotoObject(fileUrl)

    PhotoService->>PhotoRepository: 8: savePhoto(photo)
    activate PhotoRepository
    PhotoRepository-->>PhotoService: 8.1: saved photo
    deactivate PhotoRepository

    PhotoService->>Album: 9: addPhotoToAlbum(photo)
    activate Album
    Album-->>PhotoService: 9.1: updated album
    deactivate Album

    PhotoService-->>PhotoController: 10: photo details
    deactivate PhotoService

    PhotoController-->>PhotoInterface: 11: Response with photo details
    deactivate PhotoController

    PhotoInterface-->>User: 12: Upload success
    deactivate PhotoInterface
    deactivate User

```



#### 浏览图片

```mermaid
sequenceDiagram
    actor User as :User
    participant PhotoInterface as :PhotoInterface
    participant PhotoController as :PhotoController
    participant PhotoService as :PhotoService
    participant PhotoRepository as :PhotoRepository

    User->>PhotoInterface: 1: getPhoto(photoId)
    activate User
    activate PhotoInterface

    PhotoInterface->>PhotoController: 2: Forward getPhoto(photoId)
    activate PhotoController

    PhotoController->>PhotoService: 3: Fetch photo(photoId)
    activate PhotoService

    PhotoService->>PhotoRepository: 4: Query photo by ID(photoId)
    activate PhotoRepository
    PhotoRepository-->>PhotoService: 4.1: Photo data
    deactivate PhotoRepository

    PhotoService-->>PhotoController: 5: Photo details {id, name, url, ...}
    deactivate PhotoService

    PhotoController-->>PhotoInterface: 6: Photo details {id, name, url, ...}
    deactivate PhotoController

    PhotoInterface-->>User: 7: Response: Photo details
    deactivate PhotoInterface
    deactivate User

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
![tables](static/imgs/tables.png)

<!-- ```mermaid -->
<!-- classDiagram -->
<!-- direction BT -->
<!-- class albums { -->
<!--    varchar(255) category -->
<!--    varchar(255) description -->
<!--    varchar(255) title -->
<!--    bigint user_id -->
<!--    bigint id -->
<!-- } -->
<!-- class comments { -->
<!--    timestamp comment_time -->
<!--    varchar(255) content -->
<!--    bigint photo_id -->
<!--    bigint user_id -->
<!--    bigint id -->
<!-- } -->
<!-- class photos { -->
<!--    varchar(255) description -->
<!--    varchar(255) file_path -->
<!--    varchar(255) title -->
<!--    timestamp upload_time -->
<!--    bigint album_id -->
<!--    bigint id -->
<!-- } -->
<!-- class users { -->
<!--    varchar(255) email -->
<!--    boolean is_admin -->
<!--    varchar(255) password -->
<!--    varchar(255) username -->
<!--    bigint id -->
<!-- } -->
<!---->
<!-- albums  -->  users : user_id:id -->
<!-- comments  -->  photos : photo_id:id -->
<!-- comments  -->  users : user_id:id -->
<!-- photos  -->  albums : album_id:id -->
<!-- ``` -->

### 表设计


