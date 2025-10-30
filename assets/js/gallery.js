(function () {
  "use strict";
  // Konfiguration
  const CONFIG = {
    watermarkText: "© JK",
    likeKey: "galleryLikesV2",
    authorName: "Johann Kramer",
    defaultFilter: "Alle",
    darkModeClass: "dark-mode",
    animationEnabled: !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
    lazyLoadThreshold: 300, // px
    analyticsEnabled: true,
    deepLinkEnabled: true,
    blurEffect: true,
    kenBurnsEffect: true,
    showFullscreenButton: true,
    showDownloadButton: false,
    showToolbar: true,
    showThumbnails: false,
    showKeyboardShortcuts: true,
    masonryLayout: true,
    responsiveTags: true,
    imagePath: "assets/img/gallerie/",
    thumbPath: "assets/img/gallerie/thumbs/",
    webpPath: "assets/img/gallerie/webp/",
    avifPath: "assets/img/gallerie/avif/",
    placeholderPath: "assets/img/gallerie/placeholders/",
  };

  const images = [
    {
      id: "g1",
      src: "assets/img/gallerie/Galerie_1.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_1.JPG",
      caption: "Kubushäuser Rotterdam",
      tags: ["Stadt", "Architektur"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_1.webp",
      avif: "assets/img/gallerie/avif/Galerie_1.avif",
      watermark: true,
    },
    {
      id: "g2",
      src: "assets/img/gallerie/Galerie_2.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_2.JPG",
      caption: "Wiener Hauptbahnhof",
      tags: ["Eisenbahn","Österreich"],
      orientation: "portrait",
      webp: "assets/img/gallerie/webp/Galerie_2.webp",
      avif: "assets/img/gallerie/avif/Galerie_2.avif",
      watermark: true,
    },
    {
      id: "g3",
      src: "assets/img/gallerie/Galerie_3.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_3.JPG",
      caption: "Stubaier Gletscher",
      tags: ["Österreich","Winter"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_3.webp",
      avif: "assets/img/gallerie/avif/Galerie_3.avif",
      watermark: true,
    },
    {
      id: "g4",
      src: "assets/img/gallerie/Galerie_4.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_4.JPG",
      caption: "Schloss Moritzburg",
      tags: ["Sachsen","Architektur"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_4.webp",
      avif: "assets/img/gallerie/avif/Galerie_4.avif",
      watermark: true,
    },
    {
      id: "g5",
      src: "assets/img/gallerie/Galerie_5.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_5.JPG",
      caption: "Fichtelbergbahn",
      tags: ["Winter","Eisenbahn","Sachsen"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_5.webp",
      avif: "assets/img/gallerie/avif/Galerie_5.avif",
      watermark: true,
    },
    {
      id: "g6",
      src: "assets/img/gallerie/Galerie_6.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_6.JPG",
      caption: "Deutscher Bundestag",
      tags: ["Architektur", "Stadt", "Berlin", "Politik"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_6.webp",
      avif: "assets/img/gallerie/avif/Galerie_6.avif",
      watermark: true,
    },
    {
      id: "g7",
      src: "assets/img/gallerie/Galerie_7.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_7.JPG",
      caption: "U55 der BVG",
      tags: ["Stadt", "Berlin", "Eisenbahn"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_7.webp",
      avif: "assets/img/gallerie/avif/Galerie_7.avif",
      watermark: true,
    },
    {
      id: "g8",
      src: "assets/img/gallerie/Galerie_8.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_8.JPG",
      caption: "Zinnowitz",
      tags: ["Tiere", "Natur"],
      orientation: "portrait",
      webp: "assets/img/gallerie/webp/Galerie_8.webp",
      avif: "assets/img/gallerie/avif/Galerie_8.avif",
      watermark: true,
    },
    {
      id: "g9",
      src: "assets/img/gallerie/Galerie_9.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_9.JPG",
      caption: "Maisfeld",
      tags: ["Sachsen","Natur"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_9.webp",
      avif: "assets/img/gallerie/avif/Galerie_9.avif",
      watermark: true,
    },
    {
      id: "g10",
      src: "assets/img/gallerie/Galerie_10.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_10.JPG",
      caption: "Vogelleitung",
      tags: ["Tiere", "Natur"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_10.webp",
      avif: "assets/img/gallerie/avif/Galerie_10.avif",
      watermark: true,
    },
    {
      id: "g11",
      src: "assets/img/gallerie/Galerie_11.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_11.JPG",
      caption: "Stumpfgleis",
      tags: ["Eisenbahn"],
      orientation: "portrait",
      webp: "assets/img/gallerie/webp/Galerie_11.webp",
      avif: "assets/img/gallerie/avif/Galerie_11.avif",
      watermark: true,
    },
    {
      id: "g12",
      src: "assets/img/gallerie/Galerie_12.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_12.JPG",
      caption: "Nachthimmel",
      tags: ["Natur","Nacht"],
      orientation: "portrait",
      webp: "assets/img/gallerie/webp/Galerie_12.webp",
      avif: "assets/img/gallerie/avif/Galerie_12.avif",
      watermark: true,
    },
    {
      id: "g13",
      src: "assets/img/gallerie/Galerie_13.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_13.JPG",
      caption: "EU Parlament",
      tags: ["Brüssel","Politik"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_13.webp",
      avif: "assets/img/gallerie/avif/Galerie_13.avif",
      watermark: true,
    },
    {
      id: "g14",
      src: "assets/img/gallerie/Galerie_14.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_14.JPG",
      caption: "Abgeordnetenbank",
      tags: ["Brüssel","Politik"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_14.webp",
      avif: "assets/img/gallerie/avif/Galerie_14.avif",
      watermark: true,
    },
    {
      id: "g15",
      src: "assets/img/gallerie/Galerie_15.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_15.JPG",
      caption: "Die EU",
      tags: ["Brüssel","Politik"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_15.webp",
      avif: "assets/img/gallerie/avif/Galerie_15.avif",
      watermark: true,
    },
    {
      id: "g16",
      src: "assets/img/gallerie/Galerie_16.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_16.JPG",
      caption: "Rechteck",
      tags: ["Brüssel","Architektur"],
      orientation: "portrait",
      webp: "assets/img/gallerie/webp/Galerie_16.webp",
      avif: "assets/img/gallerie/avif/Galerie_16.avif",
      watermark: true,
    },
    {
      id: "g17",
      src: "assets/img/gallerie/Galerie_17.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_17.JPG",
      caption: "EU Kommission",
      tags: ["Brüssel","Politik"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_17.webp",
      avif: "assets/img/gallerie/avif/Galerie_17.avif",
      watermark: true,
    },
    {
      id: "g18",
      src: "assets/img/gallerie/Galerie_18.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_18.JPG",
      caption: "Atomium",
      tags: ["Brüssel","Architektur"],
      orientation: "portrait",
      webp: "assets/img/gallerie/webp/Galerie_18.webp",
      avif: "assets/img/gallerie/avif/Galerie_18.avif",
      watermark: true,
    },
    {
      id: "g19",
      src: "assets/img/gallerie/Galerie_19.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_19.JPG",
      caption: "Verkehrsfluss",
      tags: ["Brüssel","Nacht"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_19.webp",
      avif: "assets/img/gallerie/avif/Galerie_19.avif",
      watermark: true,
    },
    {
      id: "g20",
      src: "assets/img/gallerie/Galerie_20.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_20.JPG",
      caption: "Ski Stubai",
      tags: ["Österreich","Winter"],
      orientation: "portrait",
      webp: "assets/img/gallerie/webp/Galerie_20.webp",
      avif: "assets/img/gallerie/avif/Galerie_20.avif",
      watermark: true,
    },
    {
      id: "g21",
      src: "assets/img/gallerie/Galerie_21.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_21.JPG",
      caption: "DB",
      tags: ["Stadt","Architektur","Eisenbahn","Berlin"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_21.webp",
      avif: "assets/img/gallerie/avif/Galerie_21.avif",
      watermark: true,
    },
    {
      id: "g22",
      src: "assets/img/gallerie/Galerie_22.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_22.JPG",
      caption: "Sonnenuntergang",
      tags: ["Natur"],
      orientation: "portrait",
      webp: "assets/img/gallerie/webp/Galerie_22.webp",
      avif: "assets/img/gallerie/avif/Galerie_22.avif",
      watermark: true,
    },
    {
      id: "g23",
      src: "assets/img/gallerie/Galerie_23.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_23.JPG",
      caption: "Finance Tower",
      tags: ["Brüssel","Stadt","Architektur"],
      orientation: "portrait",
      webp: "assets/img/gallerie/webp/Galerie_23.webp",
      avif: "assets/img/gallerie/avif/Galerie_23.avif",
      watermark: true,
    },
    {
      id: "g24",
      src: "assets/img/gallerie/Galerie_24.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_24.JPG",
      caption: "Sportwagen",
      tags: ["Brüssel","Stadt"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_24.webp",
      avif: "assets/img/gallerie/avif/Galerie_24.avif",
      watermark: true,
    },
    {
      id: "g25",
      src: "assets/img/gallerie/Galerie_25.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_25.JPG",
      caption: "E-Mobilität",
      tags: ["Brüssel","Stadt"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_25.webp",
      avif: "assets/img/gallerie/avif/Galerie_25.avif",
      watermark: true,
    },
    {
      id: "g26",
      src: "assets/img/gallerie/Galerie_26.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_26.JPG",
      caption: "Railjet",
      tags: ["Sachsen","Eisenbahn","Nacht"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_26.webp",
      avif: "assets/img/gallerie/avif/Galerie_26.avif",
      watermark: true,
    },
    {
      id: "g27",
      src: "assets/img/gallerie/Galerie_27.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_27.JPG",
      caption: "Marienbrücke",
      tags: ["Sachsen","Eisenbahn","Stadt"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_27.webp",
      avif: "assets/img/gallerie/avif/Galerie_27.avif",
      watermark: true,
    },
    {
      id: "g28",
      src: "assets/img/gallerie/Galerie_28.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_28.JPG",
      caption: "Schwanrennen",
      tags: ["Tiere", "Natur","Stadt","Österreich"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_28.webp",
      avif: "assets/img/gallerie/avif/Galerie_28.avif",
      watermark: true,
    },
    {
      id: "g29",
      src: "assets/img/gallerie/Galerie_29.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_29.JPG",
      caption: "Museumsinsel",
      tags: ["Berlin","Architektur","Eisenbahn"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_29.webp",
      avif: "assets/img/gallerie/avif/Galerie_29.avif",
      watermark: true,
    },
    {
      id: "g30",
      src: "assets/img/gallerie/Galerie_30.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_30.JPG",
      caption: "Bundestag",
      tags: ["Berlin","Stadt","Architektur","Politik"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_30.webp",
      avif: "assets/img/gallerie/avif/Galerie_30.avif",
      watermark: true,
    },
    {
      id: "g31",
      src: "assets/img/gallerie/Galerie_31.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_31.JPG",
      caption: "Love",
      tags: ["Natur", "Österreich"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_31.webp",
      avif: "assets/img/gallerie/avif/Galerie_31.avif",
      watermark: true,
    },
    {
      id: "g32",
      src: "assets/img/gallerie/Galerie_32.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_32.JPG",
      caption: "Alpen",
      tags: ["Natur", "Österreich"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_32.webp",
      avif: "assets/img/gallerie/avif/Galerie_32.avif",
      watermark: true,
    },
    {
      id: "g33",
      src: "assets/img/gallerie/Galerie_33.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_33.JPG",
      caption: "Mittelalterlich",
      tags: ["Stadt", "Architektur"],
      orientation: "portrait",
      webp: "assets/img/gallerie/webp/Galerie_33.webp",
      avif: "assets/img/gallerie/avif/Galerie_33.avif",
      watermark: true,
    },
    {
      id: "g34",
      src: "assets/img/gallerie/Galerie_34.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_34.JPG",
      caption: "Fachwerk",
      tags: ["Stadt", "Architektur"],
      orientation: "portrait",
      webp: "assets/img/gallerie/webp/Galerie_34.webp",
      avif: "assets/img/gallerie/avif/Galerie_34.avif",
      watermark: true,
    },
    {
      id: "g35",
      src: "assets/img/gallerie/Galerie_35.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_35.JPG",
      caption: "Blumenmeer",
      tags: ["Natur","Stadt"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_35.webp",
      avif: "assets/img/gallerie/avif/Galerie_35.avif",
      watermark: true,
    },
    {
      id: "g36",
      src: "assets/img/gallerie/Galerie_36.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_36.JPG",
      caption: "Bim",
      tags: ["Stadt", "Architektur","Österreich","Eisenbahn"],
      orientation: "portrait",
      webp: "assets/img/gallerie/webp/Galerie_36.webp",
      avif: "assets/img/gallerie/avif/Galerie_36.avif",
      watermark: true,
    },
    {
      id: "g37",
      src: "assets/img/gallerie/Galerie_37.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_37.JPG",
      caption: "Katze",
      tags: ["Sachsen","Tiere"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_37.webp",
      avif: "assets/img/gallerie/avif/Galerie_37.avif",
      watermark: true,
    },
    {
      id: "g38",
      src: "assets/img/gallerie/Galerie_38.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_38.JPG",
      caption: "Lilienstein",
      tags: ["Natur","Sachsen","Nacht"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_38.webp",
      avif: "assets/img/gallerie/avif/Galerie_38.avif",
      watermark: true,
    },
    {
      id: "g39",
      src: "assets/img/gallerie/Galerie_39.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_39.JPG",
      caption: "Memorium",
      tags: ["Brüssel"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_39.webp",
      avif: "assets/img/gallerie/avif/Galerie_39.avif",
      watermark: true,
    },
    {
      id: "g40",
      src: "assets/img/gallerie/Galerie_40.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_40.JPG",
      caption: "Skispringer",
      tags: ["Winter"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_40.webp",
      avif: "assets/img/gallerie/avif/Galerie_40.avif",
      watermark: true,
    },
    {
      id: "g41",
      src: "assets/img/gallerie/Galerie_41.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_41.JPG",
      caption: "Lufthansa",
      tags: ["Natur"],
      orientation: "portrait",
      webp: "assets/img/gallerie/webp/Galerie_41.webp",
      avif: "assets/img/gallerie/avif/Galerie_41.avif",
      watermark: true,
    },
    {
      id: "g42",
      src: "assets/img/gallerie/Galerie_42.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_42.JPG",
      caption: "Wien",
      tags: ["Stadt", "Architektur","Österreich"],
      orientation: "portrait",
      webp: "assets/img/gallerie/webp/Galerie_42.webp",
      avif: "assets/img/gallerie/avif/Galerie_42.avif",
      watermark: true,
    },
    {
      id: "g43",
      src: "assets/img/gallerie/Galerie_43.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_43.JPG",
      caption: "Farbenfroh",
      tags: ["Österreich"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_43.webp",
      avif: "assets/img/gallerie/avif/Galerie_43.avif",
      watermark: true,
    },
    {
      id: "g44",
      src: "assets/img/gallerie/Galerie_44.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_44.JPG",
      caption: "Feuerspektakel",
      tags: ["Nacht","Sachsen"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_44.webp",
      avif: "assets/img/gallerie/avif/Galerie_44.avif",
      watermark: true,
    },
    {
      id: "g45",
      src: "assets/img/gallerie/Galerie_45.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_45.JPG",
      caption: "Sonnenaufgang",
      tags: ["Sachsen","Natur"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_45.webp",
      avif: "assets/img/gallerie/avif/Galerie_45.avif",
      watermark: true,
    },
    {
      id: "g46",
      src: "assets/img/gallerie/Galerie_46.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_46.JPG",
      caption: "Morgenstund'",
      tags: ["Sachsen","Natur"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_46.webp",
      avif: "assets/img/gallerie/avif/Galerie_46.avif",
      watermark: true,
    },
    {
      id: "g47",
      src: "assets/img/gallerie/Galerie_47.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_47.JPG",
      caption: "Skyview",
      tags: ["Natur","Österreich"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_47.webp",
      avif: "assets/img/gallerie/avif/Galerie_47.avif",
      watermark: true,
    },
    {
      id: "g48",
      src: "assets/img/gallerie/Galerie_48.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_48.JPG",
      caption: "Alpenblühn",
      tags: ["Natur","Österreich"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_48.webp",
      avif: "assets/img/gallerie/avif/Galerie_48.avif",
      watermark: true,
    },
    {
      id: "g49",
      src: "assets/img/gallerie/Galerie_49.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_49.JPG",
      caption: "Kapelle",
      tags: ["Natur","Österreich","Architektur"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_49.webp",
      avif: "assets/img/gallerie/avif/Galerie_49.avif",
      watermark: true,
    },
    {
      id: "g50",
      src: "assets/img/gallerie/Galerie_50.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_50.JPG",
      caption: "Küste",
      tags: ["Natur","Architektur"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_50.webp",
      avif: "assets/img/gallerie/avif/Galerie_50.avif",
      watermark: true,
    },
    {
      id: "g51",
      src: "assets/img/gallerie/Galerie_51.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_51.JPG",
      caption: "Rotterdam",
      tags: ["Stadt","Architektur"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_51.webp",
      avif: "assets/img/gallerie/avif/Galerie_51.avif",
      watermark: true,
    },
    {
      id: "g52",
      src: "assets/img/gallerie/Galerie_52.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_52.JPG",
      caption: "Berlaymont",
      tags: ["Brüssel","Politik"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_52.webp",
      avif: "assets/img/gallerie/avif/Galerie_52.avif",
      watermark: true,
    },
    {
      id: "g53",
      src: "assets/img/gallerie/Galerie_53.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_53.JPG",
      caption: "Landeanflug",
      tags: ["Nacht"],
      orientation: "portrait",
      webp: "assets/img/gallerie/webp/Galerie_53.webp",
      avif: "assets/img/gallerie/avif/Galerie_53.avif",
      watermark: true,
    },
    {
      id: "g54",
      src: "assets/img/gallerie/Galerie_54.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_54.JPG",
      caption: "Lichtmalerei",
      tags: ["Nacht","Sachsen"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_54.webp",
      avif: "assets/img/gallerie/avif/Galerie_54.avif",
      watermark: true,
    },
    {
      id: "g55",
      src: "assets/img/gallerie/Galerie_55.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_55.JPG",
      caption: "Innsbruck",
      tags: ["Architektur","Österreich"],
      orientation: "portrait",
      webp: "assets/img/gallerie/webp/Galerie_55.webp",
      avif: "assets/img/gallerie/avif/Galerie_55.avif",
      watermark: true,
    },
    {
      id: "g56",
      src: "assets/img/gallerie/Galerie_56.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_56.JPG",
      caption: "Gletscher",
      tags: ["Natur","Österreich","Winter"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_56.webp",
      avif: "assets/img/gallerie/avif/Galerie_56.avif",
      watermark: true,
    },
    {
      id: "g57",
      src: "assets/img/gallerie/Galerie_57.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_57.JPG",
      caption: "Heimat",
      tags: ["Natur"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_57.webp",
      avif: "assets/img/gallerie/avif/Galerie_57.avif",
      watermark: true,
    },
    {
      id: "g58",
      src: "assets/img/gallerie/Galerie_58.JPG",
      thumb: "assets/img/gallerie/thumbs/Galerie_58.JPG",
      caption: "Kijk-Kubus",
      tags: ["Stadt","Architektur"],
      orientation: "landscape",
      webp: "assets/img/gallerie/webp/Galerie_58.webp",
      avif: "assets/img/gallerie/avif/Galerie_58.avif",
      watermark: true,
    },
  ];

  // State
  let activeTag = CONFIG.defaultFilter;
  let current = 0;
  let lightbox = null;
  let likes = loadLikes();
  let isDarkMode =
    document.documentElement.getAttribute("data-theme") === "dark";
  let isControlsVisible = true;
  let controlsHideTimeout = null;
  let isFullscreen = false;
  let isZoomed = false;

  // Cache
  const imageCache = {};

  // Event-Tracking
  function trackEvent(action, props = {}) {
    if (!CONFIG.analyticsEnabled || typeof gtag !== "function") return;

    const defaultProps = {
      event_category: "gallery",
      non_interaction: false,
      component: "gallery",
      theme: isDarkMode ? "dark" : "light",
    };

    gtag("event", action, { ...defaultProps, ...props });
  }

  // Hilfsfunktionen
  function loadLikes() {
    try {
      return JSON.parse(localStorage.getItem(CONFIG.likeKey)) || {};
    } catch (e) {
      console.warn("Fehler beim Laden der Favoriten:", e);
      return {};
    }
  }

  function saveLikes() {
    try {
      localStorage.setItem(CONFIG.likeKey, JSON.stringify(likes));
    } catch (e) {
      console.warn("Fehler beim Speichern der Favoriten:", e);
    }
  }

  function allTags() {
    const s = new Set();
    images.forEach((x) => x.tags?.forEach((t) => s.add(t)));
    return Array.from(s).sort((a, b) => a.localeCompare(b, "de"));
  }

  function getTagCount(tag) {
    if (tag === CONFIG.defaultFilter) return images.length;
    return images.filter((img) => img.tags?.includes(tag)).length;
  }

  function filtered() {
    return activeTag === CONFIG.defaultFilter
      ? images
      : images.filter((i) => i.tags?.includes(activeTag));
  }

  function escapeHtml(s) {
    if (s === null || s === undefined) return "";
    return String(s).replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[m])
    );
  }

  function preloadImage(url) {
    if (imageCache[url]) return imageCache[url];

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        imageCache[url] = img;
        resolve(img);
      };
      img.onerror = reject;
    });
  }

  function preloadAdjacent() {
    const prevIdx = (current - 1 + images.length) % images.length;
    const nextIdx = (current + 1) % images.length;

    // Preload next and previous
    if (images[prevIdx]) preloadImage(images[prevIdx].src);
    if (images[nextIdx]) preloadImage(images[nextIdx].src);
  }

  // Deep-Link Funktionalität (#photo=ID und #tag=TAG)
  function setDeepLink(type, value) {
    if (!CONFIG.deepLinkEnabled) return;

    try {
      const newHash = `#${type}=${encodeURIComponent(value)}`;
      const oldHash = location.hash;

      if (oldHash !== newHash) {
        history.pushState({ [type]: value }, "", newHash);
        trackEvent(`gallery_deeplink_set`, { type, value });
      }
    } catch (e) {
      console.warn("Fehler beim Setzen des Deep Links:", e);
    }
  }

  function clearDeepLink() {
    if (!CONFIG.deepLinkEnabled) return;

    try {
      if (location.hash) {
        history.pushState({}, "", location.pathname + location.search);
        trackEvent("gallery_deeplink_clear");
      }
    } catch (e) {
      console.warn("Fehler beim Löschen des Deep Links:", e);
    }
  }

  function getDeepLinkPhotoId() {
    const m = location.hash.match(/^#photo=([^&]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function getDeepLinkTag() {
    const m = location.hash.match(/^#tag=([^&]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function onHashChange() {
    const photoId = getDeepLinkPhotoId();
    const tag = getDeepLinkTag();

    // Zuerst nach Tag schauen
    if (tag) {
      const allAvailableTags = [CONFIG.defaultFilter, ...allTags()];
      // Prüfen ob der Tag existiert
      if (allAvailableTags.includes(tag)) {
        activeTag = tag;
        renderTags();
        renderGrid();
        trackEvent("gallery_tag_change_from_hash", { tag });
      }
      return;
    }

    // Dann nach Photo schauen
    if (photoId) {
      const idx = images.findIndex((i) => i.id === photoId);
      if (idx > -1) {
        openLightbox(idx, { fromHash: true });
      }
      return;
    }

    // Falls keine gültigen Werte gefunden wurden und Lightbox offen ist, schließen
    if (lightbox && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  }

  // Erweiterter Schutz vor Downloads
  function protect() {
    // Standard-Schutz
    document.addEventListener(
      "contextmenu",
      (e) => {
        if (
          e.target.closest(
            ".gallery-thumb, .gallery-lightbox-img, .no-save-shield, .gallery-section"
          )
        ) {
          e.preventDefault();
          e.stopPropagation();
          showProtectionHint();
          trackEvent("gallery_protection_triggered", { method: "contextmenu" });
          return false;
        }
      },
      { capture: true }
    );

    document.addEventListener(
      "dragstart",
      (e) => {
        if (
          e.target.closest(
            ".gallery-thumb, .gallery-lightbox-img, .gallery-section img"
          )
        ) {
          e.preventDefault();
          e.stopPropagation();
          trackEvent("gallery_protection_triggered", { method: "dragstart" });
          return false;
        }
      },
      { capture: true }
    );

    // Erweiterte Schutzmaßnahmen
    document.addEventListener(
      "keydown",
      (e) => {
        // Verhindern von Bildschirmfotos und Speichern-Kombinationen
        if (
          (e.ctrlKey || e.metaKey) &&
          ["s", "S", "p", "P", "u", "U", "c", "C", "PrintScreen"].includes(
            e.key
          )
        ) {
          if (
            document.querySelector(".gallery-lightbox.active") ||
            e.target.closest(".gallery-section")
          ) {
            e.preventDefault();
            e.stopPropagation();
            showProtectionHint();
            trackEvent("gallery_protection_triggered", {
              method: "keyboard",
              key: e.key,
            });
            return false;
          }
        }
      },
      { capture: true }
    );

    // Verhindern von Copy-Befehlen im Bereich der Galerie
    document.addEventListener(
      "copy",
      (e) => {
        if (e.target.closest(".gallery-section, .gallery-lightbox")) {
          e.preventDefault();
          trackEvent("gallery_protection_triggered", { method: "copy" });
          return false;
        }
      },
      { capture: true }
    );

    // Erweiterte Touch-Schutzmaßnahmen
    document.addEventListener(
      "touchstart",
      (e) => {
        const target = e.target.closest(
          ".gallery-thumb img, .gallery-lightbox-img"
        );
        if (target && e.touches.length > 1) {
          e.preventDefault(); // Verhindert Pinch-to-Zoom in manchen Browsern
          trackEvent("gallery_protection_triggered", { method: "touchstart" });
        }
      },
      { passive: false }
    );

    // CSS-basierter Schutz
    const style = document.createElement("style");
    style.textContent = `
      .gallery-section img, .gallery-lightbox-img {
        -webkit-touch-callout: none !important;
        -webkit-user-select: none !important;
        user-select: none !important;
        -webkit-user-drag: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Zeigt einen Hinweis, dass die Bilder geschützt sind
  let protectionHintTimeout;
  function showProtectionHint() {
    let hint = document.getElementById("gallery-protection-hint");
    if (!hint) {
      hint = document.createElement("div");
      hint.id = "gallery-protection-hint";
      hint.className = "gallery-protection-hint";
      hint.innerHTML =
        '<div><i class="ri-lock-line"></i> Diese Bilder sind urheberrechtlich geschützt.</div>';
      hint.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s;
      `;
      document.body.appendChild(hint);
    }

    clearTimeout(protectionHintTimeout);

    // Animation
    hint.style.opacity = "0";
    setTimeout(() => {
      hint.style.opacity = "1";
    }, 10);

    protectionHintTimeout = setTimeout(() => {
      hint.style.opacity = "0";
    }, 3000);
  }

  // Stellt sicher, dass die Galerie-Grundstruktur existiert
  function ensureGalleryContainers() {
    const host = document.getElementById("gallery");
    if (!host) return;

    // Titel optional
    if (!host.querySelector(".gallery-title")) {
      const h2 = document.createElement("h2");
      h2.className = "gallery-title";
      h2.textContent = "Galerie";
      host.appendChild(h2);
    }

    if (!document.getElementById("gallery-tags")) {
      const tagsBar = document.createElement("div");
      tagsBar.id = "gallery-tags";
      tagsBar.className = "gallery-tags";
      host.appendChild(tagsBar);
    }

    if (!document.getElementById("gallery-grid")) {
      const grid = document.createElement("div");
      grid.id = "gallery-grid";
      grid.className = "gallery-grid";
      host.appendChild(grid);
    }
  }

  // Render Tag-Filter - verbessert für Responsivität
  function renderTags() {
    let bar = document.getElementById("gallery-tags");
    if (!bar) return;

    const tags = [CONFIG.defaultFilter, ...allTags()];
    bar.innerHTML = "";
    bar.setAttribute("role", "tablist");

    // Container für responsive Tag-Filter
    const tagContainer = document.createElement("div");
    tagContainer.className = "gallery-tags-container";

    // Dropdown für mobile Ansicht
    const tagDropdown = document.createElement("div");
    tagDropdown.className = "gallery-tags-dropdown";

    const dropdownButton = document.createElement("button");
    dropdownButton.className = "gallery-tags-dropdown-btn";
    dropdownButton.innerHTML = `${escapeHtml(
      activeTag
    )} <span class="dropdown-arrow">▼</span>`;
    dropdownButton.setAttribute("aria-haspopup", "true");
    dropdownButton.setAttribute("aria-expanded", "false");

    const dropdownContent = document.createElement("div");
    dropdownContent.className = "gallery-tags-dropdown-content";
    dropdownContent.setAttribute("role", "menu");

    // Event-Handler für Dropdown-Toggle
    dropdownButton.onclick = (e) => {
      e.stopPropagation();
      dropdownContent.classList.toggle("show");
      dropdownButton.setAttribute(
        "aria-expanded",
        dropdownContent.classList.contains("show")
      );

      // Schließen des Dropdowns beim Klick außerhalb
      function closeDropdown(e) {
        if (!e.target.closest(".gallery-tags-dropdown")) {
          dropdownContent.classList.remove("show");
          dropdownButton.setAttribute("aria-expanded", "false");
          document.removeEventListener("click", closeDropdown);
        }
      }

      if (dropdownContent.classList.contains("show")) {
        setTimeout(() => document.addEventListener("click", closeDropdown), 0);
      }
    };

    // Tags für beide Ansichten erstellen
    tags.forEach((t) => {
      const count = getTagCount(t);
      const isActive = activeTag === t;

      // Button für Desktop-Ansicht
      const b = document.createElement("button");
      b.className = "gallery-tag-btn" + (isActive ? " active" : "");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", isActive ? "true" : "false");
      b.setAttribute("tabindex", isActive ? "0" : "-1");
      b.setAttribute("id", `tag-btn-${t.toLowerCase().replace(/\s+/g, "-")}`);
      b.dataset.tag = t;

      b.innerHTML = `${escapeHtml(
        t
      )} <span class="gallery-filter-count">${count}</span>`;

      // Dropdown-Item für mobile Ansicht
      const dropdownItem = document.createElement("button");
      dropdownItem.className =
        "gallery-tags-dropdown-item" + (isActive ? " active" : "");
      dropdownItem.setAttribute("role", "menuitem");
      dropdownItem.setAttribute("aria-selected", isActive ? "true" : "false");
      dropdownItem.dataset.tag = t;

      dropdownItem.innerHTML = `${escapeHtml(
        t
      )} <span class="gallery-filter-count">${count}</span>`;

      // Event-Handler für beide Ansichten
      const tagClickHandler = () => {
        if (activeTag === t) return; // Bereits aktiv

        activeTag = t;
        renderTags();
        renderGrid();

        // Deep-Link setzen, außer für "Alle"
        if (t === CONFIG.defaultFilter) {
          clearDeepLink();
        } else {
          setDeepLink("tag", t);
        }

        trackEvent("gallery_tag_change", {
          tag: t,
          count,
          viewport: window.innerWidth <= 768 ? "mobile" : "desktop",
        });
      };

      b.onclick = tagClickHandler;
      dropdownItem.onclick = tagClickHandler;

      // Animation der Buttons
      b.style.animationDelay = `${tags.indexOf(t) * 0.05}s`;
      b.classList.add("gallery-fade-in");

      // Zu entsprechenden Containern hinzufügen
      tagContainer.appendChild(b);
      dropdownContent.appendChild(dropdownItem);
    });

    // Dropdown zusammenbauen und zum Bar hinzufügen
    tagDropdown.appendChild(dropdownButton);
    tagDropdown.appendChild(dropdownContent);

    // Alles zur Bar hinzufügen
    bar.appendChild(tagDropdown); // Mobile
    bar.appendChild(tagContainer); // Desktop

    // CSS für responsive Tags injizieren, falls noch nicht vorhanden
    injectResponsiveTagsCSS();
  }

  // CSS für responsive Tags
  function injectResponsiveTagsCSS() {
    if (document.getElementById("gallery-responsive-tags-style")) return;

    const style = document.createElement("style");
    style.id = "gallery-responsive-tags-style";
    style.textContent = `
      .gallery-tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 1.5rem;
      }
      
      .gallery-tag-btn {
        padding: 6px 12px;
        border-radius: 20px;
        border: 1px solid var(--gallery-tag-border-color, rgba(0,0,0,0.1));
        background: var(--gallery-tag-bg, #f5f5f5);
        color: var(--gallery-tag-color, #333);
        font-size: 0.9rem;
        transition: all 0.2s ease;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      
      .gallery-tag-btn:hover {
        background: var(--gallery-tag-hover-bg, #e9e9e9);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      
      .gallery-tag-btn.active {
        background: var(--gallery-tag-active-bg, #0a84ff);
        color: var(--gallery-tag-active-color, white);
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(10, 132, 255, 0.3);
      }
      
      .gallery-filter-count {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 20px;
        height: 20px;
        padding: 0 4px;
        margin-left: 6px;
        background-color: var(--gallery-count-bg, rgba(255,255,255,0.3));
        color: var(--gallery-count-color, inherit);
        border-radius: 10px;
        font-size: 0.8rem;
        font-weight: 600;
      }
      
      .gallery-tag-btn.active .gallery-filter-count {
        background-color: var(--gallery-count-active-bg, rgba(255,255,255,0.25));
      }
      
      /* Dropdown für mobile Ansicht */
      .gallery-tags-dropdown {
        display: none;
        position: relative;
        width: 100%;
        margin-bottom: 1rem;
      }
      
      .gallery-tags-dropdown-btn {
        width: 100%;
        padding: 10px 15px;
        background: var(--gallery-dropdown-bg, #f5f5f5);
        border: 1px solid var(--gallery-dropdown-border, rgba(0,0,0,0.1));
        border-radius: 8px;
        text-align: left;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
      }
      
      .gallery-tags-dropdown-content {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        max-height: 60vh;
        overflow-y: auto;
        background: var(--gallery-dropdown-content-bg, white);
        border: 1px solid var(--gallery-dropdown-border, rgba(0,0,0,0.1));
        border-radius: 8px;
        margin-top: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
      }
      
      .gallery-tags-dropdown-content.show {
        display: block;
        animation: fadeIn 0.2s ease;
      }
      
      .gallery-tags-dropdown-item {
        width: 100%;
        padding: 10px 15px;
        text-align: left;
        background: none;
        border: none;
        border-bottom: 1px solid var(--gallery-dropdown-divider, rgba(0,0,0,0.05));
        cursor: pointer;
        transition: background 0.2s;
        display: flex;
        justify-content: space-between;
      }
      
      .gallery-tags-dropdown-item:last-child {
        border-bottom: none;
      }
      
      .gallery-tags-dropdown-item:hover {
        background: var(--gallery-dropdown-hover, rgba(0,0,0,0.05));
      }
      
      .gallery-tags-dropdown-item.active {
        background: var(--gallery-dropdown-active-bg, #f0f7ff);
        color: var(--gallery-dropdown-active-color, #0a84ff);
        font-weight: 600;
      }
      
      /* Dark Mode Anpassungen */
      html[data-theme="dark"] .gallery-tag-btn {
        background: var(--gallery-tag-bg, #333);
        color: var(--gallery-tag-color, #eee);
        border-color: var(--gallery-tag-border-color, rgba(255,255,255,0.1));
      }
      
      html[data-theme="dark"] .gallery-tag-btn:hover {
        background: var(--gallery-tag-hover-bg, #444);
      }
      
      html[data-theme="dark"] .gallery-tags-dropdown-btn {
        background: var(--gallery-dropdown-bg, #333);
        color: var(--gallery-dropdown-color, #eee);
        border-color: var(--gallery-dropdown-border, rgba(255,255,255,0.1));
      }
      
      html[data-theme="dark"] .gallery-tags-dropdown-content {
        background: var(--gallery-dropdown-content-bg, #222);
        color: var(--gallery-dropdown-content-color, #eee);
        border-color: var(--gallery-dropdown-border, rgba(255,255,255,0.1));
      }
      
      html[data-theme="dark"] .gallery-tags-dropdown-item {
        color: var(--gallery-dropdown-item-color, #eee);
        border-color: var(--gallery-dropdown-divider, rgba(255,255,255,0.05));
      }
      
      html[data-theme="dark"] .gallery-tags-dropdown-item:hover {
        background: var(--gallery-dropdown-hover, rgba(255,255,255,0.05));
      }
      
      html[data-theme="dark"] .gallery-tags-dropdown-item.active {
        background: var(--gallery-dropdown-active-bg, rgba(10, 132, 255, 0.2));
      }
      
      /* Responsive Anpassungen */
      @media (max-width: 768px) {
        .gallery-tags-container {
          display: none;
        }
        
        .gallery-tags-dropdown {
          display: block;
        }
        
        .gallery-tag-btn {
          font-size: 0.85rem;
          padding: 5px 10px;
        }
      }
      
      @media (max-width: 480px) {
        .gallery-filter-count {
          min-width: 18px;
          height: 18px;
          font-size: 0.75rem;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // Render Grid mit Masonry-Layout
  function renderGrid() {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;

    // Loader anzeigen während Grid gerendert wird
    grid.innerHTML =
      '<div class="gallery-loading"><div class="gallery-lightbox-loader" style="display:block"></div></div>';

    // Verzögerung, um Loader anzuzeigen
    setTimeout(() => {
      const filteredImages = filtered();

      if (filteredImages.length === 0) {
        grid.innerHTML = `<div class="gallery-empty">Keine Bilder mit dem Tag "${escapeHtml(
          activeTag
        )}" gefunden.</div>`;
        return;
      }

      // Masonry-Layout
      grid.innerHTML = "";
      grid.className = "gallery-grid masonry-grid";

      // Columnen für Masonry-Layout erstellen
      const columnCount = getOptimalColumnCount();
      const columns = [];

      // CSS-Variable für Spaltenanzahl setzen
      document.documentElement.style.setProperty("--column-count", columnCount);

      for (let i = 0; i < columnCount; i++) {
        const column = document.createElement("div");
        column.className = "masonry-column";
        column.style.width = `calc(${100 / columnCount}% - ${
          ((columnCount - 1) * 15) / columnCount
        }px)`;
        columns.push(column);
        grid.appendChild(column);
      }

      // Bilder auf Columnen verteilen
      filteredImages.forEach((img, idx) => {
        const card = createThumbnail(img, idx);

        // Kürzeste Spalte ermitteln (korrekte Implementierung)
        const shortestColumn = columns.reduce((prev, curr) => {
          return (curr.offsetHeight || curr.clientHeight) <
            (prev.offsetHeight || prev.clientHeight)
            ? curr
            : prev;
        }, columns[0]);

        shortestColumn.appendChild(card);
      });

      // Event-Listener für Größenänderungen
      const resizeHandler = debounce(() => {
        const newColumnCount = getOptimalColumnCount();
        if (newColumnCount !== columns.length) {
          renderGrid(); // Grid neu rendern, wenn sich die Spaltenzahl ändert
        }
      }, 250);

      window.removeEventListener("resize", resizeHandler); // Alten Listener entfernen
      window.addEventListener("resize", resizeHandler);

      // Lazy-Loading-Beobachter hinzufügen
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const img = entry.target.querySelector("img");
                if (img && img.dataset.src) {
                  img.src = img.dataset.src;
                  img.removeAttribute("data-src");
                }
                observer.unobserve(entry.target);
              }
            });
          },
          { rootMargin: `${CONFIG.lazyLoadThreshold}px` }
        );

        document.querySelectorAll(".gallery-thumb").forEach((thumb) => {
          observer.observe(thumb);
        });
      }

      // Masonry CSS injizieren, falls noch nicht vorhanden
      injectMasonryCSS();
    }, 10);

    // Hilfsfunktion: Optimale Spaltenanzahl basierend auf Viewport
    function getOptimalColumnCount() {
      const viewportWidth = window.innerWidth;
      if (viewportWidth <= 480) return 1;
      if (viewportWidth <= 768) return 2;
      if (viewportWidth <= 1024) return 3;
      if (viewportWidth <= 1440) return 4;
      return 5; // Für sehr große Bildschirme
    }

    // Hilfsfunktion: Erstellen eines Thumbnails
    function createThumbnail(img, idx) {
      const card = document.createElement("div");
      card.className = "gallery-thumb";
      card.setAttribute("data-id", img.id);
      card.setAttribute("data-idx", String(idx));
      card.setAttribute("tabindex", "0"); // Keyboard-Navigation
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Bild: ${img.caption}`);
      card.style.setProperty(
        "--aspect-ratio",
        img.orientation === "portrait" ? "3/4" : "4/3"
      );

      const liked = !!likes[img.id];

      // Animation verzögern basierend auf Position
      card.style.animationDelay = `${idx * 0.05}s`;

      card.innerHTML = `
        <div class="no-save-shield" aria-hidden="true"></div>
        <div class="copy-protection-overlay" aria-hidden="true"></div>
        <picture>
          <source srcset="${img.avif}" type="image/avif">
          <source srcset="${img.webp}" type="image/webp">
          <img src="${img.thumb}" alt="${escapeHtml(img.caption)}" 
               loading="lazy" draggable="false" width="300" height="300">
        </picture>
        <div class="gallery-thumb-caption">${escapeHtml(img.caption)}</div>
        <div class="gallery-thumb-tags">${img.tags
          .map(
            (t) =>
              `<span class='gallery-tag' data-tag="${escapeHtml(
                t
              )}">${escapeHtml(t)}</span>`
          )
          .join("")}</div>
        <div class="gallery-watermark">${CONFIG.watermarkText}</div>
        <button class="gallery-like-btn${
          liked ? " active" : ""
        }" aria-label="Favorisieren" title="Favorisieren">${
        liked ? "❤" : "♡"
      }</button>
      `;

      // Click-Handler für Öffnen des Lightbox
      card.addEventListener("click", (e) => {
        if (e.target.closest(".gallery-like-btn, .gallery-tag")) return; // Klicks auf Tags oder Like-Button nicht öffnen

        const baseIdx = images.findIndex((x) => x.id === img.id);
        openLightbox(baseIdx);
      });

      // Keyboard-Handler für Barrierefreiheit
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const baseIdx = images.findIndex((x) => x.id === img.id);
          openLightbox(baseIdx);
        }
      });

      // Tag-Klick-Handler
      card.querySelectorAll(".gallery-tag").forEach((tagEl) => {
        tagEl.addEventListener("click", (e) => {
          e.stopPropagation();
          const tag = tagEl.dataset.tag;
          if (tag && tag !== activeTag) {
            activeTag = tag;
            renderTags();
            renderGrid();
            setDeepLink("tag", tag);
            trackEvent("gallery_tag_click_from_thumb", { tag });
          }
        });
      });

      // Like-Button-Handler
      card.querySelector(".gallery-like-btn").onclick = (e) => {
        e.stopPropagation();
        toggleLike(img.id, e.currentTarget);
      };

      return card;
    }
  }

  // CSS für Masonry-Layout
  function injectMasonryCSS() {
    if (document.getElementById("gallery-masonry-style")) return;

    const style = document.createElement("style");
    style.id = "gallery-masonry-style";
    style.textContent = `
      .masonry-grid {
        display: flex;
        width: 100%;
        max-width: 1200px;
        gap: 15px;
        margin: 0 auto;
        padding: 0 1rem;
        box-sizing: border-box;
        align-items: flex-start;
      }
      
      .masonry-column {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 15px;
        min-width: 0;
        width: 100%;
      }
      
      .gallery-thumb {
        width: 100%;
        position: relative;
        overflow: hidden;
        border-radius: 8px;
        background: var(--gallery-thumb-bg, #fff);
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        margin: 0;
        animation: galleryFadeIn 0.5s ease both;
        aspect-ratio: 1 / 1; /* Bild füllt Container vollständig */
      }
      
      .gallery-thumb picture {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
      
      .gallery-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.5s ease;
      }
      
      /* Keyboard-Shortcuts Styling */
      .lightbox-keyboard-shortcuts {
        position: absolute;
        bottom: 20px;
        right: 20px;
        background: var(--gallery-lightbox-shortcuts-bg, rgba(0,0,0,0.7));
        color: var(--gallery-lightbox-shortcuts-color, #fff);
        padding: 12px;
        border-radius: 8px;
        font-size: 12px;
        z-index: 10005;
        display: flex;
        flex-direction: column;
        gap: 5px;
        opacity: 0.7;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }
      
      .lightbox-keyboard-shortcuts:hover {
        opacity: 1;
      }
      
      .keyboard-shortcut { display: flex; align-items: center; gap: 8px; }
      .key { min-width: 24px; height: 24px; padding: 0 5px; background: var(--gallery-key-bg, rgba(255,255,255,0.2)); border-radius: 4px; font-family: monospace; font-weight: bold; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
      
      .gallery-thumb:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.15); }
      
      .gallery-thumb-caption { padding: 12px 15px 8px; font-weight: 500; color: var(--gallery-caption-color, #333); }
      .gallery-thumb-tags { padding: 0 15px 12px; display: flex; flex-wrap: wrap; gap: 5px; }
      .gallery-thumb .gallery-tag { font-size: 0.75rem; padding: 3px 8px; border-radius: 12px; background: var(--gallery-tag-small-bg, rgba(0,0,0,0.05)); color: var(--gallery-tag-small-color, #666); cursor: pointer; transition: all 0.2s ease; }
      .gallery-thumb .gallery-tag:hover { background: var(--gallery-tag-small-hover-bg, rgba(0,0,0,0.1)); transform: translateY(-2px); }
      
      html[data-theme="dark"] .gallery-thumb { background: var(--gallery-thumb-bg, #222); box-shadow: 0 3px 10px rgba(0,0,0,0.3); }
      html[data-theme="dark"] .gallery-thumb-caption { color: var(--gallery-caption-color, #eee); }
      html[data-theme="dark"] .gallery-thumb .gallery-tag { background: var(--gallery-tag-small-bg, rgba(255,255,255,0.1)); color: var(--gallery-tag-small-color, #ccc); }
      html[data-theme="dark"] .gallery-thumb .gallery-tag:hover { background: var(--gallery-tag-small-hover-bg, rgba(255,255,255,0.15)); }
      
      @media (max-width: 768px) {
        .masonry-grid { gap: 10px; padding: 0 .75rem; }
        .masonry-column { gap: 10px; }
        .gallery-thumb-caption { padding: 10px 12px 6px; font-size: 0.9rem; }
        .gallery-thumb-tags { padding: 0 12px 10px; }
      }
      
      @media (max-width: 480px) {
        .masonry-grid { 
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .masonry-column { 
          width: 100% !important; 
        }
        .gallery-thumb-caption { font-size: 0.85rem; }
        .gallery-thumb .gallery-tag { font-size: 0.7rem; padding: 2px 6px; }
      }
      
      @keyframes galleryFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `;

    document.head.appendChild(style);
  }

  // Hilfsfunktion: Debounce für Event-Handler
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function toggleLike(id, btn) {
    likes[id] = !likes[id];

    // UI aktualisieren
    if (btn) {
      btn.textContent = likes[id] ? "❤" : "♡";
      btn.classList.toggle("active", likes[id]);

      // Animation
      btn.style.transform = likes[id] ? "scale(1.3)" : "scale(0.8)";
      setTimeout(() => {
        btn.style.transform = "scale(1)";
      }, 300);
    }

    // In allen Thumbs aktualisieren
    document
      .querySelectorAll(`.gallery-thumb[data-id="${id}"] .gallery-like-btn`)
      .forEach((el) => {
        el.textContent = likes[id] ? "❤" : "♡";
        el.classList.toggle("active", likes[id]);
      });

    saveLikes();
    trackEvent("gallery_like", { id, liked: likes[id] });
  }

  // Lightbox – komplett neu aufgebaut
  function ensureLightbox() {
    if (lightbox) return lightbox;

    const lb = document.createElement("div");
    lb.className = "gallery-lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-labelledby", "lightbox-title");

    lb.innerHTML = `
      <div class="gallery-lightbox-toolbar">
        <div class="glb-left">
          <button class="gallery-lightbox-close" aria-label="Schließen" title="Schließen (Esc)">&times;</button>
        </div>
        <div class="glb-center">
          <span class="gallery-lightbox-title" id="lightbox-title"></span>
        </div>
        <div class="glb-right">
          <button class="gallery-like-toggle" aria-label="Favorisieren" title="Als Favorit markieren">♡</button>
          <button class="gallery-lightbox-zoom" aria-label="Zoom" title="Bild vergrößern (Z)">
            <i class="ri-zoom-in-line"></i>
          </button>
          ${
            CONFIG.showFullscreenButton
              ? `
          <button class="gallery-lightbox-fullscreen" aria-label="Vollbild" title="Vollbild (F)">
            <i class="ri-fullscreen-line"></i>
          </button>`
              : ""
          }
          ${
            CONFIG.showDownloadButton
              ? `
          <button class="gallery-lightbox-download" aria-label="Download" title="Bild herunterladen">
            <i class="ri-download-line"></i>
          </button>`
              : ""
          }
        </div>
      </div>
      
      <button class="gallery-lightbox-prev" aria-label="Vorheriges Bild" title="Vorheriges Bild (←)">&#8592;</button>
      
      ${
        CONFIG.showKeyboardShortcuts
          ? `<div class="lightbox-keyboard-shortcuts">
            <div class="keyboard-shortcut"><span class="key">←</span> Vorheriges Bild</div>
            <div class="keyboard-shortcut"><span class="key">→</span> Nächstes Bild</div>
            <div class="keyboard-shortcut"><span class="key">Esc</span> Schließen</div>
            <div class="keyboard-shortcut"><span class="key">Z</span> Zoom</div>
            <div class="keyboard-shortcut"><span class="key">F</span> Vollbild</div>
            <div class="keyboard-shortcut"><span class="key">Space</span> Controls</div>
          </div>`
          : ""
      }
      
      <div class="gallery-lightbox-media">
        <div class="gallery-lightbox-loader"></div>
        <div class="no-save-shield" aria-hidden="true"></div>
        <img class="gallery-lightbox-img" src="" alt="" draggable="false" />
      </div>
      
      <button class="gallery-lightbox-next" aria-label="Nächstes Bild" title="Nächstes Bild (→)">&#8594;</button>
      
      <div class="gallery-lightbox-caption"></div>
      <div class="gallery-lightbox-tags"></div>
      <div class="gallery-lightbox-watermark" style="display:none;">${
        CONFIG.watermarkText
      }</div>
      <div class="gallery-lightbox-index"></div>
      <div class="gallery-lightbox-thumbs"></div>
    `;

    // Event-Handler
    lb.querySelector(".gallery-lightbox-close").onclick = closeLightbox;

    lb.querySelector(".gallery-lightbox-prev").onclick = () => {
      prevImg();
      trackEvent("gallery_nav", { dir: "prev", method: "button" });
    };

    lb.querySelector(".gallery-lightbox-next").onclick = () => {
      nextImg();
      trackEvent("gallery_nav", { dir: "next", method: "button" });
    };

    lb.querySelector(".gallery-lightbox-zoom").onclick = () => {
      toggleZoom();
      trackEvent("gallery_zoom", { state: !isZoomed ? "zoomed" : "normal" });
    };

    if (CONFIG.showFullscreenButton) {
      lb.querySelector(".gallery-lightbox-fullscreen").onclick = () => {
        toggleFullscreen(lb);
        trackEvent("gallery_fullscreen", {
          state: !isFullscreen ? "fullscreen" : "normal",
        });
      };
    }

    if (CONFIG.showDownloadButton) {
      lb.querySelector(".gallery-lightbox-download").onclick = () => {
        // Implementiere Download-Funktionalität, falls gewünscht
        trackEvent("gallery_download_attempt");
      };
    }

    lb.querySelector(".gallery-like-toggle").onclick = () => {
      const id = images[current].id;
      toggleLike(id);
      updateLikeUI(lb);
      trackEvent("gallery_like_toolbar", { id, liked: likes[id] });
    };

    // Klick auf Hintergrund zum Schließen
    lb.addEventListener("click", (e) => {
      if (e.target === lb) {
        closeLightbox();
        trackEvent("gallery_close", { method: "background_click" });
      }
    });

    // Klick auf Bild zum Ein-/Ausblenden der Steuerelemente
    lb.querySelector(".gallery-lightbox-media").addEventListener(
      "click",
      (e) => {
        if (e.target.classList.contains("gallery-lightbox-img")) {
          toggleControls();
          trackEvent("gallery_toggle_controls");
        }
      }
    );

    document.body.appendChild(lb);

    // Tastatur-Navigation
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("active")) return;

      switch (e.key) {
        case "Escape":
          closeLightbox();
          trackEvent("gallery_close", { method: "keyboard", key: "Escape" });
          break;
        case "ArrowLeft":
          prevImg();
          trackEvent("gallery_nav", { dir: "prev", method: "keyboard" });
          break;
        case "ArrowRight":
          nextImg();
          trackEvent("gallery_nav", { dir: "next", method: "keyboard" });
          break;
        case "f":
        case "F":
          if (CONFIG.showFullscreenButton) {
            toggleFullscreen(lb);
            trackEvent("gallery_fullscreen", {
              state: !isFullscreen ? "fullscreen" : "normal",
              method: "keyboard",
            });
          }
          break;
        case "z":
        case "Z":
          toggleZoom();
          trackEvent("gallery_zoom", {
            state: !isZoomed ? "zoomed" : "normal",
            method: "keyboard",
          });
          break;
        case " ": // Space
          toggleControls();
          trackEvent("gallery_toggle_controls", { method: "keyboard" });
          break;
      }
    });

    // Touch-Gesten
    let startX = null,
      startY = null;
    let startTime = null;

    lb.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length === 1) {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          startTime = Date.now();
        }
      },
      { passive: true }
    );

    lb.addEventListener(
      "touchend",
      (e) => {
        if (startX === null || startY === null) return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = endX - startX;
        const diffY = endY - startY;
        const diffTime = Date.now() - startTime;

        // Wir ignorieren langsame Bewegungen oder kleine Bewegungen
        if (diffTime < 300 && Math.abs(diffX) > 50) {
          if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
              prevImg();
              trackEvent("gallery_nav", { dir: "prev", method: "swipe" });
            } else {
              nextImg();
              trackEvent("gallery_nav", { dir: "next", method: "swipe" });
            }
          }
        } else if (
          Math.abs(diffX) < 10 &&
          Math.abs(diffY) < 10 &&
          diffTime < 300
        ) {
          // Tap-Geste
          toggleControls();
          trackEvent("gallery_toggle_controls", { method: "tap" });
        }

        startX = null;
        startY = null;
      },
      { passive: true }
    );

    lightbox = lb;
    return lb;
  }

  // UI-Hilfsfunktionen
  function updateLikeUI(lb) {
    const btn = lb.querySelector(".gallery-like-toggle");
    const isLiked = likes[images[current].id];
    btn.textContent = isLiked ? "❤" : "♡";
    btn.classList.toggle("active", isLiked);
    btn.setAttribute(
      "title",
      isLiked ? "Aus Favoriten entfernen" : "Als Favorit markieren"
    );
  }

  function toggleControls() {
    if (!lightbox) return;

    clearTimeout(controlsHideTimeout);

    isControlsVisible = !isControlsVisible;
    lightbox.classList.toggle("controls-hidden", !isControlsVisible);
    lightbox.classList.toggle("no-controls", !isControlsVisible);

    // Automatisches Ausblenden nach Zeitspanne
    if (isControlsVisible) {
      controlsHideTimeout = setTimeout(() => {
        lightbox.classList.add("controls-hidden");
        lightbox.classList.add("no-controls");
        isControlsVisible = false;
      }, 3000);
    }
  }

  function openLightbox(idx, opts = {}) {
    current = idx;
    const lb = ensureLightbox();

    // Steuerelemente initial anzeigen
    isControlsVisible = true;
    lb.classList.remove("controls-hidden");
    lb.classList.remove("no-controls");

    // Bild aktualisieren
    updateLightbox({ animate: true });

    // Lightbox aktivieren
    lb.classList.add("active");
    document.body.style.overflow = "hidden";

    // Deep-Link setzen, außer wenn vom Hash navigiert
    if (!opts.fromHash) {
      setDeepLink("photo", images[current].id);
    }

    // Analytics
    trackEvent("gallery_open", {
      index: current,
      id: images[current].id,
      title: images[current].caption,
      tags: images[current].tags?.join(","),
    });

    // Vorherige/Nächste Bilder vorladen
    preloadAdjacent();

    // Automatisches Ausblenden der Steuerelemente nach einer Weile
    clearTimeout(controlsHideTimeout);
    controlsHideTimeout = setTimeout(() => {
      if (lb.classList.contains("active")) {
        lb.classList.add("controls-hidden");
        lb.classList.add("no-controls");
        isControlsVisible = false;
      }
    }, 3000);
  }

  function closeLightbox() {
    clearDeepLink();

    if (lightbox) {
      // Animation beim Schließen
      lightbox.style.opacity = "0";

      setTimeout(() => {
        lightbox.classList.remove("active");
        lightbox.style.opacity = "";
        document.body.style.overflow = "";
      }, 300);
    }

    trackEvent("gallery_close");

    // Zoom zurücksetzen
    isZoomed = false;
  }

  function prevImg() {
    current = (current - 1 + images.length) % images.length;
    setDeepLink("photo", images[current].id);
    updateLightbox({ animate: true, direction: "prev" });
    preloadAdjacent();
  }

  function nextImg() {
    current = (current + 1) % images.length;
    setDeepLink("photo", images[current].id);
    updateLightbox({ animate: true, direction: "next" });
    preloadAdjacent();
  }

  function updateLightbox(opts = {}) {
    const lb = ensureLightbox();
    const img = lb.querySelector(".gallery-lightbox-img");
    const caption = lb.querySelector(".gallery-lightbox-caption");
    const count = lb.querySelector(".gallery-lightbox-index");
    const tags = lb.querySelector(".gallery-lightbox-tags");
    const title = lb.querySelector(".gallery-lightbox-title");
    const loader = lb.querySelector(".gallery-lightbox-loader");
    const thumbBar = lb.querySelector(".gallery-lightbox-thumbs");

    // Altes Bild ausblenden wenn Animation gewünscht
    if (opts.animate) {
      const direction = opts.direction || "fade";

      // Ken-Burns/Blur Animation entfernen
      img.classList.remove("kenburns");

      if (direction === "prev") {
        img.classList.add("slide-out-right");
      } else if (direction === "next") {
        img.classList.add("slide-out-left");
      } else {
        img.classList.add("fade-out");
      }

      // Nach Animation neues Bild anzeigen
      setTimeout(() => {
        updateLightboxContent();

        // Neue Animation einfügen
        if (direction === "prev") {
          img.classList.remove("slide-out-right");
          img.classList.add("slide-in-left");
        } else if (direction === "next") {
          img.classList.remove("slide-out-left");
          img.classList.add("slide-in-right");
        } else {
          img.classList.remove("fade-out");
          img.classList.add("fade-in");
        }

        // Animationsklassen entfernen
        setTimeout(() => {
          img.classList.remove("slide-in-left", "slide-in-right", "fade-in");
        }, 500);
      }, 300);
    } else {
      updateLightboxContent();
    }

    // Like-Status aktualisieren
    updateLikeUI(lb);

    // Zoom-Status zurücksetzen
    isZoomed = false;
    img.style.transform = "";

    // Analytics
    if (!opts.skipTracking) {
      trackEvent("gallery_view", {
        index: current,
        id: images[current].id,
        title: images[current].caption,
        tags: images[current].tags?.join(","),
      });
    }

    // Hilfsfunktion: Lightbox-Inhalt aktualisieren
    function updateLightboxContent() {
      const currentImage = images[current];

      // Loader anzeigen während Bild lädt
      img.style.display = "none";
      loader.style.display = "block";

      // Bildpfad aktualisieren, bei WebP/AVIF Unterstützung diese verwenden
      const useWebP = "webP" in window ? window.webP : !!currentImage.webp;
      const useAVIF = "avif" in window ? window.avif : !!currentImage.avif;

      if (useAVIF && currentImage.avif) {
        img.src = currentImage.avif;
      } else if (useWebP && currentImage.webp) {
        img.src = currentImage.webp;
      } else {
        img.src = currentImage.src;
      }

      // Bildmetadaten aktualisieren
      img.alt = currentImage.caption || "";
      img.className =
        "gallery-lightbox-img " + (currentImage.orientation || "landscape");

      // Bild-Lade-Handler
      img.onload = () => {
        loader.style.display = "none";
        img.style.display = "block";

        // Blur-Effekt entfernen und Ken-Burns hinzufügen wenn aktiviert
        requestAnimationFrame(() => {
          img.style.filter = "blur(0) opacity(1)";
          if (CONFIG.kenBurnsEffect) {
            img.classList.add("kenburns");
          }
        });
      };

      // Bildunterschrift und Zähler aktualisieren
      caption.textContent = currentImage.caption || "";
      title.textContent = currentImage.caption || "";
      count.textContent = `${current + 1} / ${images.length}`;

      // Tags anzeigen, wenn vorhanden
      if (currentImage.tags && currentImage.tags.length > 0) {
        tags.innerHTML = currentImage.tags
          .map(
            (tag) =>
              `<span class="gallery-tag" data-tag="${tag}">${escapeHtml(
                tag
              )}</span>`
          )
          .join(" ");
        tags.style.display = "block";

        // Event-Handler für Tag-Klicks
        tags.querySelectorAll(".gallery-tag").forEach((el) => {
          el.addEventListener("click", () => {
            const tag = el.dataset.tag;
            activeTag = tag;
            closeLightbox();
            renderTags();
            renderGrid();
            setDeepLink("tag", tag);
            trackEvent("gallery_tag_click_from_lightbox", { tag });
          });
        });
      } else {
        tags.innerHTML = "";
        tags.style.display = "none";
      }

      // Wasserzeichen anzeigen/ausblenden
      lb.querySelector(".gallery-lightbox-watermark").style.display =
        currentImage.watermark ? "block" : "none";

      // Thumbnails aktualisieren
      updateThumbnails();

      // Schema.org JSON-LD für SEO aktualisieren
      injectImageJSONLD(currentImage);
    }

    // Thumbnails in der Lightbox aktualisieren
    function updateThumbnails() {
      if (!CONFIG.showThumbnails) {
        thumbBar.style.display = "none";
        return;
      }

      thumbBar.style.display = "flex";

      // Nur sichtbare Thumbnails für Performance generieren
      const startIdx = Math.max(0, current - 3);
      const endIdx = Math.min(images.length, current + 4);
      const visibleImages = images.slice(startIdx, endIdx);

      thumbBar.innerHTML = visibleImages
        .map((im, localIdx) => {
          const globalIdx = startIdx + localIdx;
          return `<img src="${im.thumb}" 
                 class="gallery-thumb-mini${
                   globalIdx === current ? " active" : ""
                 }" 
                 data-idx="${globalIdx}" 
                 alt="" 
                 title="${escapeHtml(im.caption)}" 
                 draggable="false" 
                 style="user-select:none;">`;
        })
        .join("");

      // Event-Handler für Thumbnail-Klicks
      thumbBar.querySelectorAll("img").forEach((el) => {
        el.addEventListener("click", () => {
          const idx = parseInt(el.dataset.idx, 10);
          current = idx;
          setDeepLink("photo", images[current].id);
          updateLightbox({ animate: true });
          trackEvent("gallery_thumbnail_click", { index: idx });
        });
      });
    }
  }

  function toggleZoom() {
    if (!lightbox) return;

    const img = lightbox.querySelector(".gallery-lightbox-img");
    const zoomBtn = lightbox.querySelector(".gallery-lightbox-zoom i");

    isZoomed = !isZoomed;

    if (isZoomed) {
      img.classList.add("zoomed");
      img.style.transform = "scale(2)";
      zoomBtn.classList.remove("ri-zoom-in-line");
      zoomBtn.classList.add("ri-zoom-out-line");

      // Draggable Image im Zoom-Modus
      let isDragging = false;
      let startX,
        startY,
        startTranslateX = 0,
        startTranslateY = 0;

      function onMouseDown(e) {
        if (!isZoomed) return;
        e.preventDefault();

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        // Aktuelle Translation extrahieren
        const transform = window
          .getComputedStyle(img)
          .getPropertyValue("transform");
        const matrix = new DOMMatrixReadOnly(transform);
        startTranslateX = matrix.m41;
        startTranslateY = matrix.m42;

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      }

      function onMouseMove(e) {
        if (!isDragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        // Begrenzen der Bewegung
        const maxMove = 150; // Maximale Bewegung in Pixel
        const newX = Math.max(
          -maxMove,
          Math.min(maxMove, startTranslateX + dx)
        );
        const newY = Math.max(
          -maxMove,
          Math.min(maxMove, startTranslateY + dy)
        );

        img.style.transform = `scale(2) translate(${newX / 2}px, ${
          newY / 2
        }px)`;
      }

      function onMouseUp() {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      img.addEventListener("mousedown", onMouseDown);
      img.addEventListener("dragstart", (e) => e.preventDefault());

      // Cleanup
      img._zoomCleanup = () => {
        img.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
    } else {
      img.classList.remove("zoomed");
      img.style.transform = "";
      zoomBtn.classList.remove("ri-zoom-out-line");
      zoomBtn.classList.add("ri-zoom-in-line");

      // Cleanup
      if (img._zoomCleanup) {
        img._zoomCleanup();
        img._zoomCleanup = null;
      }
    }

    trackEvent("gallery_zoom_toggle", {
      state: isZoomed ? "zoomed" : "normal",
    });
  }

  function toggleFullscreen(el) {
    if (!el) el = lightbox;
    if (!el) return;

    isFullscreen = !isFullscreen;
    const fullscreenBtn = el.querySelector(".gallery-lightbox-fullscreen i");

    if (isFullscreen) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch((err) => {
          console.warn("Fehler beim Aktivieren des Vollbildmodus:", err);
          isFullscreen = false;
        });
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }

      fullscreenBtn.classList.remove("ri-fullscreen-line");
      fullscreenBtn.classList.add("ri-fullscreen-exit-line");
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.warn("Fehler beim Beenden des Vollbildmodus:", err);
        });
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }

      fullscreenBtn.classList.remove("ri-fullscreen-exit-line");
      fullscreenBtn.classList.add("ri-fullscreen-line");
    }

    trackEvent("gallery_fullscreen_toggle", {
      state: isFullscreen ? "fullscreen" : "normal",
    });
  }

  // Dynamisches JSON-LD (Schema.org ImageObject)
  function injectImageJSONLD(data) {
    let el = document.getElementById("gallery-imagejsonld");
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = "gallery-imagejsonld";
      document.head.appendChild(el);
    }

    const baseUrl = location.href.split("#")[0];
    const fullImageUrl = new URL(data.src, baseUrl).href;

    const json = {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      contentUrl: fullImageUrl,
      name: data.caption,
      description: data.description || data.caption,
      author: {
        "@type": "Person",
        name: CONFIG.authorName,
      },
      keywords: data.tags.join(", "),
      caption: data.caption,
      datePublished: data.dateCreated || new Date().toISOString().split("T")[0],
      encodingFormat: data.src.split(".").pop().toUpperCase(),
    };

    if (data.location) {
      json.contentLocation = {
        "@type": "Place",
        name: data.location,
      };
    }

    el.textContent = JSON.stringify(json);
  }

  // Loader CSS dynamisch (falls nicht global)
  function injectLoaderCSS() {
    if (document.getElementById("gallery-loader-style")) return;

    const style = document.createElement("style");
    style.id = "gallery-loader-style";

    // CSS mit erweiterten Animationen und Effekten
    style.textContent = `
      /* Loader */
      .gallery-lightbox-loader {
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid var(--gallery-accent-color, #0a84ff);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 10002;
        display: none;
      }
      
      @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
      
      /* Thumbnails */
      .gallery-lightbox-thumbs {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        margin: 1rem auto;
        overflow-x: auto;
        max-width: 90vw;
        padding: 0.5rem;
        scrollbar-width: thin;
        scrollbar-color: rgba(255,255,255,0.3) rgba(0,0,0,0.2);
      }
      
      .gallery-thumb-mini {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 6px;
        opacity: 0.7;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 2px solid transparent;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
      
      .gallery-thumb-mini:hover {
        opacity: 0.9;
        transform: translateY(-2px);
      }
      
      .gallery-thumb-mini.active {
        opacity: 1;
        border: 2px solid var(--gallery-accent-color, #0a84ff);
        transform: scale(1.1);
      }
      
      /* Like Button */
      .gallery-like-btn, .gallery-like-toggle {
        background: var(--gallery-lightbox-btn-bg, rgba(0,0,0,0.4));
        color: var(--gallery-lightbox-btn-color, #fff);
        border: none;
        border-radius: 999px;
        padding: 0.25rem 0.55rem;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 1.2rem;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .gallery-like-btn {
        position: absolute;
        left: 0.5rem;
        bottom: 0.5rem;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      }
      
      .gallery-like-btn:hover, .gallery-like-toggle:hover {
        background: var(--gallery-lightbox-btn-bg-hover, rgba(20,20,20,0.5));
        transform: scale(1.1);
      }
      
      .gallery-like-btn.active, .gallery-like-toggle.active {
        color: var(--gallery-like-active-color, #ff3b30);
      }
      
      /* Lightbox Toolbar */
      .gallery-lightbox-toolbar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
        background: linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0));
        color: var(--gallery-lightbox-text-color, #fff);
        z-index: 10002;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      
      .gallery-lightbox-title {
        font-weight: 700;
        opacity: 0.95;
        font-size: 1.1rem;
        text-shadow: 0 1px 3px rgba(0,0,0,0.5);
        max-width: 50vw;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .glb-left, .glb-center, .glb-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .glb-center {
        flex: 1;
        justify-content: center;
      }
      
      /* Animationen für Bilder */
      .gallery-lightbox-img {
        transition: filter 0.35s ease, transform 0.25s ease;
        will-change: transform, filter;
      }
      
      .kenburns {
        animation: kenburnsAnim 15s ease-out forwards;
      }
      
      .zoomed {
        cursor: move;
      }
      
      @keyframes kenburnsAnim {
        0% { transform: scale(1); }
        100% { transform: scale(1.05); }
      }
      
      /* Übergangsanimationen */
      .fade-out {
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .fade-in {
        opacity: 1;
        transition: opacity 0.3s ease;
      }
      
      .slide-out-left {
        transform: translateX(-5%);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }
      
      .slide-out-right {
        transform: translateX(5%);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }
      
      .slide-in-left {
        transform: translateX(0);
        opacity: 1;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }
      
      .slide-in-right {
        transform: translateX(0);
        opacity: 1;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }
      
      /* UI-Steuerelemente */
      .gallery-lightbox.controls-hidden .gallery-lightbox-toolbar,
      .gallery-lightbox.controls-hidden .gallery-lightbox-prev,
      .gallery-lightbox.controls-hidden .gallery-lightbox-next,
      .gallery-lightbox.controls-hidden .gallery-lightbox-thumbs,
      .gallery-lightbox.controls-hidden .gallery-lightbox-index {
        opacity: 0;
        pointer-events: none;
      }
      
      .gallery-lightbox-prev, 
      .gallery-lightbox-next,
      .gallery-lightbox-close {
        transition: all 0.2s ease;
      }
      
      .gallery-lightbox-prev:hover, 
      .gallery-lightbox-next:hover {
        transform: scale(1.1);
        background: var(--gallery-lightbox-btn-bg-hover, rgba(20,20,20,0.5));
      }
      
      /* Responsive Anpassungen */
      @media (max-width: 768px) {
        .gallery-lightbox-title {
          font-size: 0.9rem;
          max-width: 40vw;
        }
        
        .gallery-lightbox-toolbar {
          height: 50px;
        }
        
        .gallery-thumb-mini {
          width: 40px;
          height: 40px;
        }
        
        .gallery-lightbox-prev, 
        .gallery-lightbox-next {
          font-size: 1.5rem;
          padding: 0.5rem;
        }
      }
      
      /* Warnhinweis für geschützte Bilder */
      .gallery-protection-hint {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s;
      }
      
      /* Dark Mode Anpassungen */
      :root[data-theme="dark"] .gallery-like-btn,
      :root[data-theme="dark"] .gallery-like-toggle {
        background: rgba(255,255,255,0.2);
        color: #fff;
      }
      
      :root[data-theme="dark"] .gallery-like-btn.active,
      :root[data-theme="dark"] .gallery-like-toggle.active {
        color: #ff453a;
      }
    `;

    document.head.appendChild(style);
  }

  function initBrowserFeatureDetection() {
    // WebP-Unterstützungserkennung
    const checkWebP = new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src =
        "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    });

    // AVIF-Unterstützungserkennung
    const checkAVIF = new Promise((resolve) => {
      const avif = new Image();
      avif.onload = avif.onerror = () => {
        resolve(avif.height === 2);
      };
      avif.src =
        "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";
    });

    // Ergebnisse im globalen Scope speichern
    Promise.all([checkWebP, checkAVIF]).then(([hasWebP, hasAVIF]) => {
      window.webP = hasWebP;
      window.avif = hasAVIF;
    });
  }

  function init() {
    // Führe Feature-Erkennung durch
    initBrowserFeatureDetection();

    // Injiziere CSS
    injectLoaderCSS();

    // Grundstruktur sicherstellen
    ensureGalleryContainers();

    // Rendere Oberfläche
    renderTags();
    renderGrid();

    // Aktiviere Bildschutz
    protect();

    // Animation-Bibliothek initialisieren, falls vorhanden
    if (window.AOS) {
      AOS.init({
        once: true,
        duration: 600,
        easing: "ease-out",
        disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
    }

    // Prüfe auf Deep-Links
    const photoId = getDeepLinkPhotoId();
    const tag = getDeepLinkTag();

    if (tag) {
      const allAvailableTags = [CONFIG.defaultFilter, ...allTags()];
      if (allAvailableTags.includes(tag)) {
        activeTag = tag;
        renderTags();
        renderGrid();
        trackEvent("gallery_tag_change_from_hash", { tag });
      }
    } else if (photoId) {
      const idx = images.findIndex((i) => i.id === photoId);
      if (idx > -1) {
        openLightbox(idx, { fromHash: true });
      }
    }

    // Überwache Hash-Änderungen
    window.addEventListener("hashchange", onHashChange);

    // Überwache Theme-Änderungen
    const observer = new MutationObserver(() => {
      const newDarkMode =
        document.documentElement.getAttribute("data-theme") === "dark";
      if (newDarkMode !== isDarkMode) {
        isDarkMode = newDarkMode;
        trackEvent("gallery_theme_change", {
          theme: isDarkMode ? "dark" : "light",
        });
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Analytics
    trackEvent("gallery_init", { imageCount: images.length });
  }

  // Initialisierung starten, wenn DOM bereit ist
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
