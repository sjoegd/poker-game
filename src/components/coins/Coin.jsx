import React from 'react';
import styled from 'styled-components';

// Black 100
// Blue  50
// Green 20
// Red   10

const StyledSvg = styled.svg`
  border: solid 0.02rem;
  border-color: ${({color}) => color};
  border-radius: 50%;
  background-color: ${({color}) => color};
`

export default function Coin(props) {
  return (
    <StyledSvg color={props.color} viewBox="0 0 301 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="150" cy="150" r="150" fill={props.color} />
      <circle cx="150" cy="150" r="100" fill="#D9D9D9" />
      <circle cx="150.5" cy="150.5" r="97.5" fill={props.color} />
      <circle cx="150" cy="150" r="85" fill="#D9D9D9" />
      <rect x="80.2426" y="204" width="23" height="6" transform="rotate(45 80.2426 204)" fill="#D9D9D9" />
      <rect x="210.243" y="76" width="23" height="6" transform="rotate(45 210.243 76)" fill="#D9D9D9" />
      <rect x="206" y="218.263" width="23" height="6" transform="rotate(-45 206 218.263)" fill="#D9D9D9" />
      <rect x="237" y="161" width="23" height="6" transform="rotate(-90 237 161)" fill="#D9D9D9" />
      <rect x="57" y="161" width="23" height="6" transform="rotate(-90 57 161)" fill="#D9D9D9" />
      <rect x="139" y="57" width="23" height="6" fill="#D9D9D9" />
      <rect x="140" y="237" width="23" height="6" fill="#D9D9D9" />
      <rect x="231.958" y="224" width="40" height="50" transform="rotate(55 231.958 224)" fill="#D9D9D9" />
      <rect x="45" y="256.766" width="40" height="50" transform="rotate(-55 45 256.766)" fill="#D9D9D9" />
      <path d="M192 47.7661L214.943 15L255.901 43.6788L232.958 76.4449L192 47.7661Z" fill="#D9D9D9" />
      <rect x="84.9576" y="15" width="40" height="50" transform="rotate(55 84.9576 15)" fill="#D9D9D9" />
      <rect x="258" y="125" width="40" height="50" fill="#D9D9D9" />
      <rect x="2" y="122" width="40" height="50" fill="#D9D9D9" />
      <path
        d="M2.51664 122L2.34584 171.932L2.14148 168.737L1.77311 166.648L1.69154 164.149L1.48717 160.954L1.4056 158.456L1.20124 155.261L1.03766 153.315M1.03766 153.315L0.874085 151.369L0.710934 146.372L0.711784 140.269L1.245 135.148L2.31143 124.908L2.10196 158.333L1.65457 135.435L1.52924 153.049L1.03766 153.315Z"
        stroke="#D9D9D9"
      />
      <path
        d="M85 15L44 43.5L46.5 41.5L48 40L50 38.5L52.5 36.5L54.5 35L57 33L58.5 31.75M58.5 31.75L60 30.5L64 27.5L69 24L73.5 21.5L82.5 16.5L55 35.5L73.5 22L59 32L58.5 31.75Z"
        stroke="#D9D9D9"
      />
      <path
        d="M255.804 43.5274L215 14.7476L217.734 16.4128L219.657 17.3093L221.751 18.6756L224.485 20.3408L226.579 21.7072L229.313 23.3724L231.001 24.3544M231.001 24.3544L232.688 25.3364L236.875 28.0691L241.875 31.5705L245.763 34.9441L253.539 41.6912L226.28 22.348L245.293 35.1151L230.937 24.9097L231.001 24.3544Z"
        stroke="#D9D9D9"
      />
      <path
        d="M45 256.748L85.8041 285.527L83.0696 283.862L81.1471 282.966L79.0535 281.599L76.319 279.934L74.2255 278.568L71.491 276.903L69.8034 275.921M69.8034 275.921L68.1157 274.939L63.9286 272.206L58.9296 268.704L55.0412 265.331L47.2646 258.584L74.5243 277.927L55.5111 265.16L69.8673 275.365L69.8034 275.921Z"
        stroke="#D9D9D9"
      />
      <path
        d="M298.346 174.932L298.517 125L298.721 128.195L299.089 130.284L299.171 132.783L299.375 135.978L299.457 138.476L299.661 141.672L299.825 143.617M299.825 143.617L299.988 145.563L300.152 150.56L300.151 156.664L299.617 161.784L298.551 172.024L298.761 138.599L299.208 161.497L299.333 143.883L299.825 143.617Z"
        stroke="#D9D9D9"
      />
      <path
        d="M214 285.5L255 257L252.5 259L251 260.5L249 262L246.5 264L244.5 265.5L242 267.5L240.5 268.75M240.5 268.75L239 270L235 273L230 276.5L225.5 279L216.5 284L244 265L225.5 278.5L240 268.5L240.5 268.75Z"
        stroke="#D9D9D9"
      />
      <rect x="76" y="92.2635" width="23" height="6" transform="rotate(-45 76 92.2635)" fill="#D9D9D9" />
    </StyledSvg>
  );
}
