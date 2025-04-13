const map = {
    tur: <>🇹🇷</>,
    aze: <>🇦🇿</>,
    bak: <>🇷🇺</>,
    kaz: <>🇰🇿</>,
    kir: <>🇰🇬</>,
    uzb: <>🇺🇿</>,
    tat: <>🇷🇺</>,
    tuk: <>🇹🇲</>,
    uig: <>🇨🇳</>,
    rus: <>🇷🇺</>,
};

const LanguageFlag ({ isoCode }: { isoCode: string }): React.JSX.Element => {
    return <>{map[isoCode]}</>;
};
