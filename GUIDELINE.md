# Burst_APP

## Best practice

### Assets

-   Always need to use svg files for icons.
-   Categories assets based on types and file name should be relevant.
-   Don't need to add multiple icons for active and inactive states, We can changes color with svg files.

### Components

-   Separate files for each component
-   Folder or filter structure should be:
    -   Folder: `ComponentName/index.jsx` (if we have more sub components)
    -   File: `ComponentName.jsx`
    -   Now you can import both components with same import statement like `import ComponentName from './ComponentName'`
-   Create single component inside single file.
-   Try to use Function components over class based components

### Screens

-   Rename `screen` to `screens`
-   Create single file with relevant route name (like for `home`, just create `screens/Home.js` instead of `screens/Home/Home.js`)

### Services

-   Create mock folder for mock data instead of creating api service as this is not relevant.
-   Create all api calls and some helper methods to services.

### Source (src)

-   Remove button folder and file from this as this is the part of components
-   We can move `screens`, `components` and `assets` inside `src`. If not then we can remove `src`.

### Tools

-   Move all files (except of `Consts.js`) to `components` folder and delete this.

### Configs

-   Create `constant.js` inside this.
-   All should follow `camelCase` or `snack_case` naming convention.
-   Include if env specific files in this if we have any.
-   Create a object for AsyncStorage key names.
-   Create a file for theme (colors, background, default margin, padding, etc) if we are not using any theme library

### Error boundary

-   Use error boundary to catch run time errors and better User experience

## Coding guideline

### File names

-   All component and screens file's extension should be `.jsx`

### Destructure props:

_Instead of doing this:_

```
const MyComponent = ({name, title})={}
```

_Do:_

```
const MyComponent = (props)={
  const {name, title} = props;
}
```

To make it more readable and clean

### Component methods:

-   Don't create function inside useEffect, Move all methods to component body and invoke inside the life cycle methods.
-   Wrap all code inside try catch if you are using.

### Extracting properties

_Avoid using let_

```
 let userProfile;
        if (item.follower) {
            userProfile = item.follower;
        } else {
            userProfile = item;
        }
```

_Do:_

```
const userProfile = item?.follower || item;

```

### Hooks

-   Create a custom hook to access `AsyncStorage`.

### Api calls

-   Can use [Redux rtk](https://redux-toolkit.js.org/introduction/getting-started)
-   Axios:
    -   Create axios instance and configure base url and auth token inside instance.
    -   Can use axios interceptor for the same.
-   Set base url in configs for notifications and create a new notification axios instance.

### Styles

-   Follow single pattern to write styles (styled-components or StyleSheet).

### Linting and Formatting

-   Need to use eslint and prettier
