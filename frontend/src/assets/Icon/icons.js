import React from 'react';
import { ReactComponent as Dashboard} from './dashboard_icon.svg'
import { ReactComponent as Chat} from './chat_icon.svg'
import { ReactComponent as Game} from './game_icon.svg'
import { ReactComponent as LeaderBoard} from './leaderboard_icon.svg'
import { ReactComponent as Logout} from './logout_icon.svg'
import { ReactComponent as setting} from './setting_icon.svg'
import { ReactComponent as Tournament} from './tournament_icon.svg'
import { ReactComponent as UserName} from './UserName.svg'
import { ReactComponent as Password} from './Password.svg'
import { ReactComponent as Notification} from './notification_icon.svg'
import { ReactComponent as search} from './search_icon.svg'
import { ReactComponent as Achievment1} from './achiev_1.svg'
import { ReactComponent as Achievment2} from './achiev_2.svg'
import { ReactComponent as Achievment3} from './achiev_3.svg'
import { ReactComponent as Achievment4} from './achiev_4.svg'
import { ReactComponent as GoldIcon} from './goldIcon.svg'
import { ReactComponent as SilverIcon} from './silverIcon.svg'
import { ReactComponent as CopperIcon} from './copperIcon.svg'
import { ReactComponent as view } from './view.svg'
import { ReactComponent as bracket } from './bracket.svg'
import { ReactComponent as history } from './history.svg'
import { ReactComponent as user } from './user_icon.svg'
import { ReactComponent as lock } from './lock_icon.svg'
import { ReactComponent as at } from './at_icon.svg'
import { ReactComponent as show_pass } from './show_pass.svg'
import { ReactComponent as hide_pass } from './hide_pass.svg'
import { ReactComponent as calendar } from './calendar.svg'
import { ReactComponent as game_mode } from './game_mode.svg'
import { ReactComponent as chump_cup } from './chump_cup.svg'
import { ReactComponent as location } from './location.svg'
import { ReactComponent as TournamentWin } from './TournomantWin.svg'
import {ReactComponent as visiteProfil} from './visiteProfil.svg'
import { ReactComponent as inviteToGame} from './InviteToGame.svg'
import {ReactComponent as block} from './Block.svg'
import {ReactComponent as startMessage} from './startMessage.svg'
import {ReactComponent as google} from './google.svg'
import {ReactComponent as Challangefriend} from './challangefriend.svg'
import {ReactComponent as BlockFriend} from './blockFriend.svg'
import {ReactComponent as ChatFriend} from './chatFriend.svg'
import {ReactComponent as AddFriend} from './addFriend.svg'
import {ReactComponent as Achiev1} from './Achiev.svg'
import {ReactComponent as inputTournamant} from './inputTournamant.svg'
import {ReactComponent as English} from './English.svg'
import {ReactComponent as Francais} from './flagFr.svg'
import {ReactComponent as Espanol} from './flagEs.svg'
import { ReactComponent as TwoFaIcon } from './2faIcon.svg'
import { ReactComponent as cancelCircle } from './cancelCircle.svg'

// import { ReactComponent as school_icon } from './school_icon.png'



const icons = {
    dashboard: Dashboard,
    chat: Chat,
    game: Game,
    search: search,
    leaderboard: LeaderBoard,
    logout: Logout,
    setting: setting,
    tournament: Tournament,
    username: UserName,
    password: Password,
    notification: Notification,
    achievment1: Achievment1,
    achievment2: Achievment2,
    achievment3: Achievment3,
    achievment4: Achievment4,
    gold : GoldIcon,
    silver : SilverIcon,
    copper : CopperIcon,
    view : view,
    bracket : bracket,
    history : history,
    user: user,
    at: at,
    lock: lock,
    show_pass : show_pass,
    hide_pass : hide_pass,
    calendar: calendar,
    game_mode: game_mode,
    chump_cup: chump_cup,
    location: location,
    TournamentWin : TournamentWin,
    VisiteProfil: visiteProfil,
    InviteToGame: inviteToGame,
    Block : block,
    StartMessage: startMessage,
    AddFriend : AddFriend,
    ChatFriend : ChatFriend,
    Challangefriend : Challangefriend,
    BlockFriend : BlockFriend,
    Achiev1 : Achiev1,
    inputTournamant : inputTournamant,
    TwoFaIcon: TwoFaIcon,
    cancelCircle: cancelCircle,
    // EN : English,
    // FR : Francais,
    // ES : Espanol,

    // school_icon: school_icon
}

const Icon = ({name, className}) => {
    const SvgIcon = icons[name];
    return (<SvgIcon className={className}/>);
};

export default Icon;