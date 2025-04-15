import { Box, Button, IconButton, SxProps, Theme, Typography } from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

const socialList = [
    {
        name: "Resume",
        url: "https://bit.ly/4ivIe3S",
        icon: DescriptionIcon
    },
    {
        name: "Email",
        url: "mailto:kiamohager@gmail.com",
        icon: EmailIcon
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

export const DesktopSocialButtonList = (props: { sx?: SxProps<Theme> | undefined }) => {
    return (
        <Box p={2} sx={props.sx} display={"flex"} flexWrap={"wrap"} justifyContent={"center"}>
            {socialList.map((socialDetails, index) => {
                return (
                    <Box key={index} mr={1}>
                        <CustomIconButton
                            href={socialDetails.url}
                            icon={socialDetails.icon}
                            text={socialDetails.name}
                            social={socialDetails.social}
                        />
                    </Box>
                );
            })}
        </Box>
    );
};


const CustomIconButton = (props: any) => {
    const Icon = props.icon;
    const ButtonType = props.social ? IconButton : Button;
    return (
        // @ts-ignore
        <ButtonType
            className={"social-button"}
            href={props.href}
            target={"_blank"}
            rel={"noopener"}
            size={"large"}
        >
            <Box sx={{ display: "flex", alignItems: "center", color: "white" }}>
                <Icon />
                {!props.social && (
                    <Box pl={2}>
                        <Typography>{props.text}</Typography>
                    </Box>
                )}
            </Box>
        </ButtonType>
    );
};