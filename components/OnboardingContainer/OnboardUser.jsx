import React, { useRef, useState } from "react";
// import { SwiperFlatList } from "react-native-swiper-flatlist";
import Swiper from "react-native-swiper";

import OnboardContainer from ".";
import { onboard1, onboard2, onboard3 } from "../../assets/onboard";
import { ONBOARD_LIST_MAIN, ONBOARD_LIST_SUB } from "../../config/data";
import OnboardingChannels from "./OnboardingChannels";
import OnboardingCreateAccount from "./OnboardingCreateAccount";
import OnboardingInvite from "./OnboardingInvite";
const OnboardUser = ({ onboardStep, setOnboardStep }) => {
    const containerProps = { onboardStep, setOnboardStep };
    const [inviteCount, setInviteCount] = useState(0);
    const [endReached, setEndReached] = useState(false);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [joinedChannels, setJoinedChannels] = useState([]);
    const [emailInviteCount, setEmailInviteCount] = useState(0);
    const [invitedEmails, setInvitedEmails] = useState([]);
    const swiperRef = useRef(null);

    const handleMomentumScrollEnd = (e, state, context) => {
        setOnboardStep(state.index);
    };

    return (
        <Swiper
            ref={swiperRef}
            loop={false}
            paginationStyle={{
                position: "absolute",
                bottom: 10,
                gap: 10,
            }}
            onIndexChanged={(index) => {
                setOnboardStep(index);
            }}
            showsPagination={onboardStep !== 5}
            dotStyle={{ height: 14, width: 14, borderRadius: 8 }}
            activeDotStyle={{ height: 16, width: 16, borderRadius: 8 }}
            // scrollEnabled={onboardStep !== 4}
            scrollEnabled={true}
        >
            <OnboardContainer
                source={onboard1}
                {...containerProps}
                mainText={ONBOARD_LIST_MAIN[0]}
                infoText={ONBOARD_LIST_SUB[0]}
            />

            <OnboardContainer
                source={onboard2}
                {...containerProps}
                mainText={ONBOARD_LIST_MAIN[1]}
                infoText={ONBOARD_LIST_SUB[1]}
                imageId={2}
            />

            <OnboardContainer
                source={onboard3}
                {...containerProps}
                mainText={ONBOARD_LIST_MAIN[3]}
                infoText={ONBOARD_LIST_SUB[3]}
            />

            <OnboardingInvite
                {...containerProps}
                inviteCount={inviteCount}
                setInviteCount={setInviteCount}
                invitedUsers={invitedUsers}
                setInvitedUsers={setInvitedUsers}
                emailInviteCount={emailInviteCount}
                setEmailInviteCount={setEmailInviteCount}
                invitedEmails={invitedEmails}
                setInvitedEmails={setInvitedEmails}
            />

            <OnboardingChannels
                {...containerProps}
                joinedChannels={joinedChannels}
                setJoinedChannels={setJoinedChannels}
            />
            <OnboardingCreateAccount
                {...containerProps}
                inviteCount={inviteCount}
                setInviteCount={setInviteCount}
                setEndReached={setEndReached}
                invitedUsers={invitedUsers}
                setInvitedUsers={setInvitedUsers}
                swiperRef={swiperRef}
                joinedChannels={joinedChannels}
                setJoinedChannels={setJoinedChannels}
                emailInviteCount={emailInviteCount}
                invitedEmails={invitedEmails}
            />
        </Swiper>
    );
};

export default OnboardUser;
