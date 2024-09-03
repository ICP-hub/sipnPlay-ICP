import React from 'react'

const LoadingPopUp = ({ gameName }) => {
    let gameImage = null;
    switch (gameName) {
        case "blackjack":
            gameImage = blackJackLogo;
            break;
        case "BallPool":
            gameImage = EBoolLogo;
            break;
        default:
            gameImage = logo;
    }
    return (
        <div>LoadingPopUp</div>
    )
}

export default LoadingPopUp