import { useEffect } from "react";
import { Feed } from "../../components/Feed"
import { UploadModal } from "../../components/UploadModal";

import { useSetRecoilState } from "recoil";
import { userdata, userid, username } from "../../atoms/userAtom";

import { db } from "../../firebase"
import { collection, getDocs, query, where } from "firebase/firestore";
import { Grid, Typography } from "@mui/material";

export default function UserHomePage({ userFound, currentUserData }) {
    if(!userFound)
        return (
            <Grid container direction="column" alignItems="center" justifyContent="center" sx={{width: "100vw", height: "100vh"}}>
                <Typography fontSize="small" variant="overline" color="red" sx={{marginTop: "1rem"}}>Error in fetching data</Typography>
                <Typography fontSize="small" variant="overline" color="red">Please trying signing in again</Typography>
            </Grid>
        );

    const setCurrentUserData = useSetRecoilState(userdata);
    const setCurrentUserID = useSetRecoilState(userid);
    const setCurrentUsername = useSetRecoilState(username);

    useEffect(() => {
        if(currentUserData) {
            setCurrentUserData(currentUserData);
            setCurrentUserID(currentUserData.uid);
            const currentUsername = currentUserData.username;
            setCurrentUsername(currentUsername);
        }
    }, [currentUserData])


    return (
        <Grid container direction="column" alignItems="center" justifyContent="center" sx={{width: "100vw", height: "100vh"}}>
            <UploadModal />
            <Feed />
        </Grid>
    );
}

export async function getServerSideProps(context) {
    const { params } = context;
    const { username } = params;

    const usersCollectionReference = collection(db, "users");
    const usernameQuery = query(usersCollectionReference, where("username", "==", username));
    const querySnapshot = await getDocs(usernameQuery);
    if(querySnapshot.empty)
        return {
            props: {
                userFound: false,
            }
        }
    const currentUserData = querySnapshot.docs[0].data();
    return {
        props: {
            userFound: true,
            currentUserData,
        },
    };
}