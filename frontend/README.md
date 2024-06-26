# BlogHub
A user-friendly and responsive blogs and articles sharing web application, where user can create posts using inbuilt editor. In this application user can create, update, delete posts and make it visible to other users.

## Table of Contents
- [BlogHub](#bloghub)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies](#technologies)
      - [Frontend-backend](#frontend-backend)
      - [Miscelleneous](#miscelleneous)
  - [Summary](#summary)
## Features
Here is the overview of the features of the project.

Login page: User can login using registered email and password.

<img src="./screenshots/singin.jpeg" alt="Alt Text - description of the image" width="70%" />

---

If the user is not registered then, he/she can register using signup page.

<img src="/screenshots/signup.jpeg" alt="Alt Text - description of the image" width="70%"/>

---

After successful login User will be redirected to the home page where one can see all the posts created by other users and marked as active.

<img src="./screenshots/home-page.jpeg" alt="Alt Text - description of the image" width="70%"/>

---

On clicking the "Add post" button on Home page, user can create a post by filling the details like title, content, featured image and status.

<img src="./screenshots/add-post.jpeg" alt="Alt Text - description of the image" width="70%"/>

---

If someone wants to update his post then, simply click on the post and if the post is created by the user who wants to edit, then he will see two buttons one is "Edit" and other is "Delete".

<img src="./screenshots/update-post.jpeg" alt="Alt Text - description of the image" width="70%"/>

---

The "Edit" and "Delete" buttons appears only to the owner of the post. The post page is given below.

<img src="./screenshots/post.jpeg" alt="Alt Text - description of the image" width="70%">


---

If someone wants to edit the Name, wants there posts at one place. All these features are present at account page.

<img src="./screenshots/account.jpeg" alt="Alt Text - description of the image" width="70%" />

## Technologies

#### Frontend-backend

| Frontend              |   Backend     |
|-----------------------|---------------|
|  HTML                 |   JavaScript  |
|  CSS                  |   Appwrite    |
|  JavaScript           |
|  React.js             |
|  Tailwind CSS         |

#### Miscelleneous
* Used react-hook-form for seamless handling of forms in this application.
* Implimented Html-react-parser for displaying the content of the page as it is on the screen, means if text is bold, colored etc then it will appear as it is using Html-react-parser.
* React-redux and Redux-toolkit for state management.
* Good practices are followed while writting the code of the project.

## Summary
BlogHub is a user-friendly web application for sharing blogs and articles, featuring a responsive design and intuitive features. Users can register and log in using email and password, create, update, and delete posts, and view posts created by other users. The application employs React.js for frontend development and Appwrite for backend services. React-redux and Redux-toolkit are used for efficient state management, while react-hook-form ensures seamless handling of forms. Good coding practices are adhered to throughout the project, ensuring reliability and maintainability.

---
