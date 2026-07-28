window.dataLayer = window.dataLayer || [];
window.gtag =
    window.gtag ||
    function gtag() {
        // biome-ignore lint/complexity/noArguments: matches Google's documented gtag.js snippet verbatim
        window.dataLayer.push(arguments);
    };

window.gtag('js', new Date());
window.gtag('config', 'G-2J7SWPGLE4', {
    anonymize_ip: true,
});
