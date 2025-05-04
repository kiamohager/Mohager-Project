import { Box, Button, IconButton, SxProps, Theme, Typography } from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

type screenProps = { sx?: SxProps<Theme> | undefined, isSmallScreen: boolean };

const socialList = [
    {
        name: "Resume",
        url: "https://bit.ly/4ivIe3S",
        icon: DescriptionIcon,
        social: true
    },
    {
        name: "Email",
        url: "mailto:kiamohager@gmail.com",
        icon: EmailIcon,
        social: true
    },
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/kia-mohager-676437193/",
        icon: LinkedInIcon,
        social: true
    },
    {
        name: "GitHub",
        url: "https://github.com/kiamohager",
        icon: GitHubIcon,
        social: true
    },
    {
        name: "Instagram",
        url: "https://www.instagram.com/kiamohager/",
        icon: InstagramIcon,
        social: true
    }
];

export const DesktopSocialButtonList = (props: screenProps) => {
    return (
        <Box p={1.5} sx={props.sx} display={"flex"} flexWrap={"wrap"} justifyContent={"center"}>
            {socialList.map((socialDetails, index) => {
                return (
                    <Box key={index}>
                        <CustomIconButton
                            href={socialDetails.url}
                            icon={socialDetails.icon}
                            text={socialDetails.name}
                            social={socialDetails.social}
                            isSmallScreen={props.isSmallScreen}
                        />
                    </Box>
                );
            })}
        </Box>
    );
};

const CustomIconButton = (props: any) => {
    const Icon = props.icon;
    const ButtonType : React.ElementType = props.social ? IconButton : Button;
    return (
        <ButtonType
            className={"social-button"}
            href={props.href}
            target={"_blank"}
            rel={"noopener"}
            size={props.isSmallScreen ? "small" : "large"}
        >
            <Box sx={{ display: "flex", alignItems: "center", color: "white" }}>
                <Icon sx={{ fontSize: props.isSmallScreen ? 17 : 25}}/>
                {!props.social && (
                    <Box pl={2}>
                        {/* <Typography color="secondary" fontFamily={"Special Gothic Expanded One"} fontSize={props.isSmallScreen ? 10 : 15}>
                            {props.text}
                        </Typography> */}
                    </Box>
                )}
            </Box>
        </ButtonType>
    );
};
