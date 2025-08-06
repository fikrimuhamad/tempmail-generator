chrome.contextMenus.create({
    id: "eMail",
    title: "use Temp eMail - Generated",
    contexts: ["editable"],
});

let currentTab;

chrome.contextMenus.onClicked.addListener((info, tab) => {
    currentTab = tab;
    setMail("Mengambil email...");

    const mailTabAction = (mail_tab) => {
        chrome.scripting.executeScript({
            target: { tabId: mail_tab.id },
            func: extractGeneratorEmail,
        });
    };

    chrome.tabs.query({
        url: '*://generator.email/*'
    }, (tabs) => {
        if (tabs.length) {
            mailTabAction(tabs[0]);
        } else {
            chrome.tabs.create({
                active: false,
                url: 'https://generator.email/',
            }, mailTabAction);
        }
    });
});

function setMail(mail) {
    chrome.tabs.sendMessage(currentTab.id, {
        action: 'insert_mail',
        data: mail,
    });
}

async function extractGeneratorEmail() {
    const usernameElement = document.getElementById('email_ch_text');
    if (!usernameElement) {
        chrome.runtime.sendMessage("Email tidak ditemukan.");
        return;
    }

    const raw = usernameElement.innerText.trim();

    let finalEmail = raw; // Default pakai email dari generator.email

    try {
        const domainFile = await fetch(chrome.runtime.getURL("domain.txt"));
        const domainsText = await domainFile.text();
        const domains = domainsText
            .split('\n')
            .map(d => d.trim())
            .filter(Boolean);

        // Kalau domain.txt tidak kosong dan ada domain valid
        if (domains.length > 0) {
            const username = raw.includes("@") ? raw.split("@")[0] : raw;
            const randomDomain = domains[Math.floor(Math.random() * domains.length)];
            finalEmail = `${username}${randomDomain.startsWith("@") ? "" : "@"}${randomDomain}`;
        }
    } catch (err) {
        console.warn("Gagal membaca domain.txt, fallback ke email asli.");
    }

    chrome.runtime.sendMessage(finalEmail);
}


chrome.runtime.onMessage.addListener((mail) => {
    setMail(mail);
});
