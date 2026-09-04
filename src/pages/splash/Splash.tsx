import appLogoLightText from "../../assets/app-logos/app-logo-light.png";
import appLogo from "../../assets/app-logos/app-logo.png";

function Splash() {
    return (
        <main className="min-h-screen bg-primary flex items-center justify-center" aria-label="Application loading">
            <div className="flex flex-col items-center justify-center">
                <img src={appLogoLightText} alt="App Logo" className="hidden md:block w-16 md:w-24 lg:w-28"/>
                <img src={appLogo} alt="App Logo" className="block md:hidden w-16 md:w-24 lg:w-28"/>
            </div>
        </main>
    )
}

export default Splash;