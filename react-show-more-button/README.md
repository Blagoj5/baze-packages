# React-show-more-button

React component that limits content (any element/elements) and adds show more button

![First impression](https://user-images.githubusercontent.com/50581470/101708915-a13f9d80-3a8e-11eb-87b5-faa458b08cb3.gif)

### Table of contents

- Usage
  - Setup
  - Default Configuration
  - Structure
  - React-show-more-button Options / Props
    - maxHeight
    - children
    - button
    - className
    - classNameButton
    - classNameButtonDiv
    - style
    - styleButton
    - styleButtonDiv
    - anchor
    - onChange
  - Anchor explanation

## Usage

### Setup

```
npm install --save react-show-more-button
```

There are two ways that you can use this components:

- The standard way, however this uses **inline-style** and if you pass classes(className) as prop, it might not work without the **!important** tag because of [specificality](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity):

```
import ShowMore from 'react-show-more-button';
```

- Requires for the consumer to have **css modules enabled**(styles, classes work like you should expect):

```
import ShowMore from 'react-show-more-button/dist/module';
```

**Note:** I personally use **next.js** in my projects and next.js doesn't allow me to import modules from within node_modules. So my choice is import **number 1**. However, with **create-react-app** both import options will work (i recommend using import **number 2**)

Imports and Implementation:

```
import ShowMore from 'react-show-more-button';

 <ShowMore maxHeight={100}>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a  took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            industry. Lorem Ipsum has been the industry's standbook. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum. Why do we use it? It is
            a long established fact that a reader will be distracted by the
            readable content of a page when looking at its layout. The point of
            using Lorem Ipsum is that it has a more-or-less normal distribution
            of letters, as opposed to using 'Content here, content here', making
            it look like readable English. Many desktop publishing packages and
            web page editors now use Lorem Ipsum as their default model text,
            and a search for 'lorem ipsum' will uncover many web sites still in
            their infancy. Various versions have ev olved over the years,
            sometimes by accident, sometimes on purpose (injected humour and the
            like)
          </p>
 </ShowMore>
```

<!-- ADDNI MAL CODE KAJ SHO GO IMPLEMENTIRASH -->

### Default Configuration

This component uses background: "#fff" (as default color), you must provide **backgroundColor** props if you want to change the color. Check **React-show-more-button Options / Props** for more information.

### Structure

Components that you can style/edit:

- main div (the container)
- button div (the container of the button)
- button (the button itself)

![Structure](https://user-images.githubusercontent.com/50581470/101808765-08a13000-3b17-11eb-8d88-b05e94000a6d.png)

**NOTE:** If the default styling/components aren't enough, you can always add you own components. Check the section bellow

### React-show-more-button Options / Props

| Property/Prop       | Type                                   | Description                                                                                                                                                                                                                                                                                              | Default     |
| ------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| maxHeight           | number                                 | The max height that you want to limit <br/> your component for                                                                                                                                                                                                                                           | 400         |
| children            | JSX.Element or JSX.Element[] or string | The content that you want to limit, pass as children                                                                                                                                                                                                                                                     |             |
| button              | JSX.Element                            | Pass custom \<button /> or \<div>, and it will be added instead of the default button                                                                                                                                                                                                                    | Blue Button |
| anchor              | string                                 | This field is used for controlling **viewport** and it should be a value for querySelector. Ex. for id -> anchor="#test", for class -> anchor=".test". **Check bellow examples, to see how it behaves**                                                                                                  |             |
| **className**       | string                                 | Adds additional class to the main container. **I would not recommend using classes props if you are using the default ShowMore (without css modules)** . However if you still decide to use classes with the **default version** you might need to pass **!important** tag to some of the css properties |             |
| classNameButon      | string                                 | Add new class to the default button, **overwrites** old one                                                                                                                                                                                                                                              |             |
| classNameButonDiv   | string                                 | Adds additional class to the button div, can be used for changing the position of button                                                                                                                                                                                                                 |             |
| style               | React.CSSProperties                    | Adds inline style to main container. **All style props are the secure way for styling this component**                                                                                                                                                                                                   |             |
| styleButton         | React.CSSProperties                    | Adds inline style to button                                                                                                                                                                                                                                                                              |             |
| styleButtonDiv      | React.CSSProperties                    | Adds inline style to button container                                                                                                                                                                                                                                                                    |             |
| defaultAnchor       | boolean                                | Anchor, viewport behaviour. If **true** it scrolls just above the content that's being wrapped                                                                                                                                                                                                           | false       |
| **backgroundColor** | string                                 | The background color to the main container, you **must provide** this property in order for the style to properly work. Instead of passing value to this property, you can also use the style prop as {background: 'green'}                                                                              | #fff, white |
| onChange            | (showValue: boolean) => void;          | Callback function that is called on state change                                                                                                                                                                                                                                                         |             |

### Anchor explanation

How the viewport behaves depending on the anchor props:

- defaultAnchor={false} - THIS IS **DEFAULT**  
  ![Anchor false](https://user-images.githubusercontent.com/50581470/101708947-b3b9d700-3a8e-11eb-82df-9b7031246717.gif)

- defaultAnchor={true}
  ![Anchor true](https://user-images.githubusercontent.com/50581470/101708985-d21fd280-3a8e-11eb-9666-846b1edc8888.gif)

- anchor="#test"
  ![Anchor value](https://user-images.githubusercontent.com/50581470/101709028-f4b1eb80-3a8e-11eb-9ad9-e394ce48932c.gif)
