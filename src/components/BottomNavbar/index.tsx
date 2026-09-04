import { NavLink } from "react-router-dom";
import Icon from "../Icons";

const BottomNavbar =()=> {
    return (
        <nav className=" flex text-nav-label text-white h-[90px] w-full items-center justify-around bg-primary">

            {/* Home */}
            <NavLink
                to="/"
                className="flex flex-col items-center justify-center"
            >
                <Icon name="homeIcon" size={24} color="white" />

                <span className="mt-1">
                    Home
                </span>
            </NavLink>


            {/* Explore */}
            <NavLink
                to="/"
                className="flex flex-col items-center justify-center"
            >
                <Icon name="directionIcon" size={24} color="white" />

                <span className="mt-1">
                    Explore
                </span>
            </NavLink>


            {/* VOYA APP LOGO - Middle */}
            <NavLink
                to="/"
                className="flex flex-col items-center justify-center"
            >
                {/* Gradient Border */}
                <div className="rounded-full bg-linear-to-tr from-gradient-purple to-gradient-blue p-[2px]">                    {/* Inner Circle */}
                    <div className="flex flex-col h-[62px] w-[62px] items-center justify-center rounded-full bg-primary">
                        <Icon name="appLogoIcon" size={28} />
                        <span className="mt-1 ">
                            Ask AI
                        </span>
                    </div>
                </div>

            </NavLink>


            {/* Trips */}
            <NavLink
                to="/"
                className="flex flex-col items-center justify-center"
            >
                <Icon name="routeIcon" size={24} color="white" />

                <span className="mt-1">
                    Trips
                </span>
            </NavLink>


            {/* More */}
            <NavLink
                to="/"
                className="flex flex-col items-center justify-center"
            >
                <Icon name="moreOptionsIcon" size={24} color="white" />

                <span className="mt-1">
                    More
                </span>
            </NavLink>

        </nav>
    );
}

export default BottomNavbar;