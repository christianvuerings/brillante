import React, { Component } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { animated, useSpring } from "react-spring";
import { useFetch } from "./hooks";

const GlobalStyle = createGlobalStyle`
	body {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
			"Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
			sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	code {
		font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
			monospace;
	}
`;

const Container = styled.div`
  background: #f2f6f2;
  height: 100vh;
  width: 100vw;
`;

const Colors = styled.div`
  align-content: center;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 15px;
  grid-template-columns: repeat(5, minmax(200px, 250px));
  grid-template-rows: 400px;
  height: 100%;
  justify-content: center;
`;

const Color = styled(animated.div)`
  align-items: center;
  background-size: cover;
  background-position: center center;
  border: 5px solid #fff;
  box-shadow: 0px 1px 10px -5px rgba(0, 0, 0, 0.3);
  display: flex;
  border-radius: 10px;
  font-weight: bold;
  font-size: 20px;
  height: 100%;
  justify-content: center;
  transition: box-shadow 0.5s;
  width: 100%;
  will-change: transform;

  :hover {
    box-shadow: 0px 3px 30px -10px rgba(0, 0, 0, 0.4);
  }
`;

type ApiResponse = [
  {
    colors: [string];
  }
];

const hexToRgb = (hex: any) =>
  hex
    .replace(
      /^([a-f\d])([a-f\d])([a-f\d])$/i,
      (r: string, g: string, b: string) => r + r + g + g + b + b
    )
    .match(/.{2}/g)
    .map((x: string) => parseInt(x, 16));

const calc = (x: number, y: number) => [
  -(y - window.innerHeight / 2) / 20,
  (x - window.innerWidth / 2) / 20,
  1.05
];
const trans = (x: number, y: number, s: number) =>
  `perspective(800px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

const ColorCard = ({ color }: { color: string }) => {
  const [props, set]: [any, any] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 500, friction: 100 }
  }));
  const rgb = hexToRgb(color);
  const brightness = (299 * rgb[0] + 587 * rgb[1] + 114 * rgb[2]) / 1000;

  const hexColor = `#${color.toLowerCase()}`;
  return (
    <Color
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      style={{
        backgroundColor: hexColor,
        color: `${brightness >= 180 ? "#000000" : "#ffffff"}aa`,
        transform: props.xys.interpolate(trans)
      }}
    >
      {hexColor}
    </Color>
  );
};

function App() {
  const {
    data,
    error
  }: {
    data: ApiResponse;
    error: ErrorEvent | null;
  } = useFetch(
    "https://www.colourlovers.com/api/palettes/top?numResults=100&format=json"
  );

  const randomColor =
    data && data.length ? data[Math.floor(Math.random() * data.length)] : null;

  return (
    <>
      <GlobalStyle />
      <Container>
        <Colors>
          {randomColor != null &&
            randomColor.colors.map((color: string, index) => (
              <ColorCard color={color} key={index} />
            ))}
        </Colors>
      </Container>
    </>
  );
}

export default App;
