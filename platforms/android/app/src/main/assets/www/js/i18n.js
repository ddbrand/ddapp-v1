function translate_strings(key, value, value2) {
    if(localStorage.getItem('language') === 'de-CH') {
        var Messages = {
            home: "Home",
            activity: "Aktivität",
            spotlights: "Spotlights",
            profile: "Profil",
            starttitle: "Bereit für dein Training, <span class=\"insert-username\"></span>?",
            qrcodelogin: "QR-Code Login",
            viewyouractivity: "Aktivitätsübersicht",
            checkoutspotlights: "Spotlights",
            browseworkouts: "Workouts",
            qrcodehint: "Scannen Sie den QR-Code, der auf dem Anmeldebildschirm des DD-Systems angezeigt wird, um sich mit dem Robotic Personal Trainer zu verbinden.",
            youractivity: "Deine Aktivitäten",
            activityintro: "Übersicht über Ihre Trainingsaktivitäten der letzten 30 Tage:",
            biggaugelabel: "von " + value + ' Punkte des Topscores',
            leftgaugelabel: "dein Rang",
            rightgaugelabel: "deine Bestleistung",
            sharetext: 'Mein Rang in ' + value + ' ist ' + value2 + '! Kannst du mich überbieten?',
            last30days: 'Letzte 30 Tage',
            leaderboardwomen: 'Leaderboard Frauen',
            leaderboardmen: 'Leaderboard Männer',
            leaderboardall: 'Leaderboard Alle',
            yourprofile: "Dein Profil, <span class=\"insert-username\"></span>",
            developermode: 'Entwickler Modus',
            changeuser: 'User wechseln',
            resetplans: "Meine Trainingspläne zurücksetzen",
            logout: "Ausloggen",
            settings: "Einstellungen",
            enablepush: "Push Benachrichtigungen zulassen",
            enabledark: "Dark Mode aktivieren",
            useroverview: "User Übersicht",
            useroverviewintro: "Klicken Sie auf einen anderen Benutzernamen, um Ihr aktuelles Konto zu wechseln oder andere Konten hinzuzufügen.",
            currentuser: "Aktiver User: <span class=\"insert-username\"></span>",
            adduser: "User hinzufügen",
            passwordforget: "Passwort vergessen?",
            registernewaccount: "Neues Konto erstellen",
        };
    } else {
        var Messages = {
            home: "Home",
            activity: "Activity",
            spotlights: "Spotlights",
            profile: "Profile",
            starttitle: "Ready for your training, <span class=\"insert-username\"></span>?",
            qrcodelogin: "QR-Code Login",
            viewyouractivity: "View Your Activity",
            checkoutspotlights: "Check Out Spotlights",
            browseworkouts: "Browse Workouts",
            qrcodehint: "Scan the QR-Code displayed on the DD System login screen to connect to the Robotic Personal Trainer.",
            youractivity: "Your activity",
            activityintro: "Overview of your training activity in the past 30 days:",
            biggaugelabel: "out of " + value + " points topscore",
            leftgaugelabel: "your rank",
            rightgaugelabel: "your personal best",
            sharetext: 'My rank in ' + value + ' is ' + value2 + '! Can you beat me?',
            last30days: 'Last 30 days',
            leaderboardwomen: 'Leaderboard Women',
            leaderboardmen: 'Leaderboard Men',
            leaderboardall: 'Leaderboard all',
            yourprofile: "Your profile, <span class=\"insert-username\"></span>",
            developermode: 'Developer Mode',
            changeuser: "Change User",
            resetplans: "Reset Selected Workouts",
            logout: "Logout",
            settings: "Settings",
            enablepush: "Enable Push Notifications",
            enabledark: "Enable Dark Mode",
            useroverview: "User Overview",
            useroverviewintro: "Click on another username to change your current account or add some accounts.",
            currentuser: "Current user: <span class=\"insert-username\"></span>",
            adduser: "Add User",
            passwordforget: "Password forget?",
            registernewaccount: "Register new account",
        };
    }

    $('.translate').each(function () {
        var stringtitle = $$(this).attr('data-string');
        $$(this).html(Messages[stringtitle]);
    });

    if(key) {
        return Messages[key];
    }
}