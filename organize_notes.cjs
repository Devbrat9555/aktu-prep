const fs = require('fs');
const path = require('path');

const data = {
  "B.Pharm": {
    "1st Sem": [
      "https://drive.google.com/drive/folders/1oKSxaXTpXevTZMDg9kkvDXKW_Vg0dMIU",
      "https://drive.google.com/drive/folders/1tjbUm1qxKV36JQdERVwS9A9ShfM8700q",
      "https://drive.google.com/drive/folders/1vqSxACxCrw1i3HfehRLYngST6fdma6fL",
      "https://drive.google.com/drive/folders/1V390mCLEY4xe0mHlP__1QZrXimVSGI5m",
      "https://drive.google.com/drive/folders/14oUCj1MxF65Py4TRZTnd4AxBNPOm9ZYn",
      "https://drive.google.com/drive/folders/1l4OBUnfE8tJn-AodclvpnGoukP8x5vk8",
      "https://drive.google.com/drive/folders/1OH77h5fQa-Ipn0oLXNuNwxsYdj3aLyMm"
    ],
    "2nd Sem": [
      "https://drive.google.com/drive/folders/1wUXuvGwrrakPYw19MhOuMi06-nXOhRfg",
      "https://drive.google.com/drive/folders/1XHlyOFFcX9WBctAxfLLJIHDfb97QlebJ",
      "https://drive.google.com/drive/folders/1UcPzIpHUV1hdCMjKXdoipHdHzaANDIUT",
      "https://drive.google.com/drive/folders/1gaK6oyGvi1i7hi84bB04vpUVAncT294o",
      "https://drive.google.com/drive/folders/168bgt1paBCD4kocUXR7YtD_fTr_miJuv",
      "https://drive.google.com/drive/folders/1ATN5DpZIcfn_V1DGzmDcrniBupN-Uox_"
    ],
    "3rd Sem": [
      "https://drive.google.com/drive/folders/1tR8UnbgsanN4DihXxKfNJ7ZMnT7E7h3d",
      "https://drive.google.com/drive/folders/14gMCmFSnh7Fdv8hHv27GXhDppldQxmqJ",
      "https://drive.google.com/drive/folders/1w39867LRd8PNYR8rHERDqCtV5sDwPTjl",
      "https://drive.google.com/drive/folders/1GyKgl_XM5O3HVZle7uLpI23mEcnTvx3T",
      "https://drive.google.com/drive/folders/1Op9ugHCfMCMVoGGa0DmnH_EQ2hHP7hg3"
    ],
    "4th Sem": [
      "https://drive.google.com/drive/folders/1zidubRuWsZuq3i8saHc_OQ1QDTAPLm36",
      "https://drive.google.com/drive/folders/1RkWTaVsk6T1cobaf_McNuxPORhwqMZHd",
      "https://drive.google.com/drive/folders/1hqiSOmIPC_VuRn77JBLpd8m36ELHYvea",
      "https://drive.google.com/drive/folders/1nu8rCPbI3OBo9zZXbWnqFQtEHoI5ivlq",
      "https://drive.google.com/drive/folders/1JdqveKR99QvdAUFzL4v5GV-z6yf3VD2M"
    ],
    "5th Sem": [
      "https://drive.google.com/drive/folders/1nHh4xpP2IW3RqeAWrlTXxBZXm1UKkpW2",
      "https://drive.google.com/drive/folders/1MjX4VwCU2yegUTXREcUXJExn5Xr37Dpm",
      "https://drive.google.com/drive/folders/1-auWsS-PJY-8QPKEBdN7MA8ofZcOd6zK",
      "https://drive.google.com/drive/folders/1cIpcka3f7NkP_fgnHRScW1puAtZobaWG",
      "https://drive.google.com/drive/folders/15sRbho-rQ2EDi21rnWR9HDxHSbxt0KgQ"
    ],
    "6th Sem": [
      "https://drive.google.com/drive/folders/1GnGgpupAa1ni1ewO2XLJf_clx9bYcW0I",
      "https://drive.google.com/drive/folders/1DB7ISBot3LQMcf9-vuugcuQ8SEd44IAU",
      "https://drive.google.com/drive/folders/1W_SdsceNaKlxfWWQBaMaIqbwmZpPm5Sd",
      "https://drive.google.com/drive/folders/1Jf48f1-BGva6bsMyxy90Qo_Q-7YCUpi8",
      "https://drive.google.com/drive/folders/1txWXCEGYoS6m55meSyzi1B7I-qmZF6U_",
      "https://drive.google.com/drive/folders/1wnwadT3oFWviTUQPy1Ufb_WQAxsRf2f1"
    ],
    "7th Sem": [
      "https://drive.google.com/drive/folders/15VGZHE1hLhh8RhDpRC04asW5y0_voFJE",
      "https://drive.google.com/drive/folders/1NaTx-gO6SWwuYftVSWLn38BKK6xteGgj",
      "https://drive.google.com/drive/folders/18vP9upgQDDP5hLwFnkK7zChhtUFsvEgG",
      "https://drive.google.com/drive/folders/1MUICVJUmQxX-6Y8Pmbnq8AnoFWNx81Kt"
    ],
    "8th Sem": [
      "https://drive.google.com/drive/folders/16Joc3xvKQsI6aUTrKjTnq1b5XcjavNRt",
      "https://drive.google.com/drive/folders/1NaaD9DtMajKRe7RNiElNMBprfKR3CPyJ",
      "https://drive.google.com/drive/folders/116PpWwbrVjZjyqhjSaHnv5YLwL-tJiT3",
      "https://drive.google.com/drive/folders/1xgg1XOxVFLOtuNBdzUfso4qJXeef_sug",
      "https://drive.google.com/drive/folders/190_8JU8Bek-nyNu_oFLl3R6ywWr71l2p",
      "https://drive.google.com/drive/folders/1tcAZfId-XeWi1cU8R-8VDgRQnDUBGma4",
      "https://drive.google.com/drive/folders/13nsjG2mOUtpAdMn0n9BlGZ_n4MxwTnpp",
      "https://drive.google.com/drive/folders/1_dYX1dn-8yR59w5nbIQ7r9Y4o5CfDvwB",
      "https://drive.google.com/drive/folders/1qfYB-6sS6enrN4jUnLzlon6DMvbmi0Za",
      "https://drive.google.com/drive/folders/1SDxjzsK_3UhEImdfzCyLH6gZdDajfq-9",
      "https://drive.google.com/drive/folders/1HRlhi6rlNPBMxs5CEcuFXC6kM-DLjx0L",
      "https://drive.google.com/drive/folders/1MapAtYAtOMSjGJgXXk0YUYa9aHcxt2Fp",
      "https://drive.google.com/drive/folders/1CEzFP-qPQJ9QWctT_xM5MHY_OHRJYgzI"
    ]
  },
  "MBA": {
    "1st Sem": [
      "https://drive.google.com/drive/folders/1DP2vvTaO-JhApiwf9oAQ5rRhnY01uuir",
      "https://drive.google.com/drive/folders/1Y3X6SOJCtEVCB9ilEHPwk3tlMFRUDE_w",
      "https://drive.google.com/drive/folders/1INU5USLQo_dDvyQ59G3NOLPIAX03-xDy",
      "https://drive.google.com/drive/folders/1tBKnowN1wW20mcHd66ZzHXifqjxitblb",
      "https://drive.google.com/drive/folders/18F-HVkGTPGri7xs2CDmeIbnH0vLv3SbS",
      "https://drive.google.com/drive/folders/18tONdaa9NdylUWBRQJd_9qu7wovnmrxy",
      "https://drive.google.com/drive/folders/1f2g1ll71IPmppO9RWW2rw7d1AFINhbvB",
      "https://drive.google.com/drive/folders/1EqbSIgpE2d80_Zi0kCuwm3mU__ns_j9A"
    ],
    "3rd Sem": [
      "https://drive.google.com/drive/folders/1MXvypnu9iPkjjYM_MMPyjIhIqxEGJeXT",
      "https://drive.google.com/drive/folders/1YvnMEtmg3EAeL95wpLWKGLrP_wGYdKm4",
      "https://drive.google.com/drive/folders/1s5Ez7oYH5hS_4O0Zwy1EFapMXrP1Eet4",
      "https://drive.google.com/drive/folders/19QOZQXw69wwIIz_P5tgVNdXJo_-DZtOr",
      "https://drive.google.com/drive/folders/1_HklTT_M7ZK3btRkMCtZmKKEFo_kGIXM",
      "https://drive.google.com/drive/folders/1JSKGiIkqsyA9jHNT5-i7nlk6-5IFaTC6",
      "https://drive.google.com/drive/folders/1uIi08ORwoFqvVeCl9opFCvufJ2Ia3tbV",
      "https://drive.google.com/drive/folders/1AhkLR4XliRGk9TvkIyridMPDfaV8aA8K",
      "https://drive.google.com/drive/folders/1Aj8AZ4gmFtoquZH_7101q3ZizYtNFJo2",
      "https://drive.google.com/drive/folders/1VNKem8oItG7rUcRObK2onbxbk6tZRlOy",
      "https://drive.google.com/drive/folders/1MsT7i_LaHqFELQpl0cYsJ7OqnlvPmqEY",
      "https://drive.google.com/drive/folders/178ZHvjt2x45gc_p2CBizjIJlDPXrqmRW",
      "https://drive.google.com/drive/folders/1O57w49vjr9dG1bmDP-NqVX_nreP-qiyu",
      "https://drive.google.com/drive/folders/156F_bMc-UR4nJi9zjbP7DlpjbLpm4leJ",
      "https://drive.google.com/drive/folders/1Eqch95uF7dcJveuaSv-ViohwFhDadS96",
      "https://drive.google.com/drive/folders/1KbKiJxcBo98qlGJHf-g902IGyixx92N6",
      "https://drive.google.com/drive/folders/1gYjpd3JKhxaiE7zXLakEeX8NjpqwTmzj",
      "https://drive.google.com/drive/folders/1hMMaq8796nvFyxGaelxsR2F2zMGFo881"
    ]
  },
  "B.Tech": {
    "1st Year": [
      "https://drive.google.com/drive/folders/1dQmS0IkSnkbz7mRJJOAprQDx9hRHf61K",
      "https://drive.google.com/drive/folders/10yC35NfiXWtEV4pYmYIOpD96dApX4zk1",
      "https://drive.google.com/drive/folders/1Y2v6FNTpJ1U-i6vZqloL-pr9bMvNa6Mq",
      "https://drive.google.com/drive/folders/1_jqHSTGScvANSGFLDZPWwG23bFzyPkdx",
      "https://drive.google.com/drive/folders/1YItuhFhm1RV2aGo3_MrYWKz9KmwT2s0C",
      "https://drive.google.com/drive/folders/1by3XoBDkyVhKfFSPhg9_c7ljLzMn8iuh",
      "https://drive.google.com/drive/folders/1vhlvuclQXtHXtNyAFSD5IyY_GTxRD7bR",
      "https://drive.google.com/drive/folders/1LtbGZwSDRpZE575COtVfnMwVyvAH1OZD",
      "https://drive.google.com/drive/folders/1bGfJGQpNDX_q8nc7VYgmushHnsvo3yq3",
      "https://drive.google.com/drive/folders/1cXBPW5M0gTnMYXqdYQImz5kKktyXGoQH",
      "https://drive.google.com/drive/folders/172i-Sy6HW12mDIraQ38F39uJV8gGvmW9",
      "https://drive.google.com/drive/folders/18_zJdD6vGEWkMDjkUWt8c_pW-UfaGr2r",
      "https://drive.google.com/drive/folders/1MR2gLP5aPRWznx0j4gd2Nm0cHzfyCG9K",
      "https://drive.google.com/drive/folders/1WOK_IFXyz0GOH9TWYHTnQ_VVbikbbwzo",
      "https://drive.google.com/file/d/1_YI42ZPznkBH_Vmn6vFItcWSdbVKRL4J/view",
      "https://drive.google.com/drive/folders/1IEZfOqKBinzNr1WefTXRFu5-Qmatz5RY",
      "https://drive.google.com/drive/folders/13PXFcL15GLIngOmXEwo8Xv8xBE0IxJt7",
      "https://drive.google.com/drive/folders/1VBOv7kuamFXwIed_5bGk0VQLorVRaKaC"
    ],
    "2nd Year": [
      "https://drive.google.com/file/d/1-18qUX5fAu8CalOuc5N_pgbqQ8h-DxaV/view",
      "https://drive.google.com/file/d/170ukWRMI9Vu1mZUswtpm-M5qL2G17lm6/view",
      "https://drive.google.com/drive/folders/1vu-tfGIOU6IOPJcI2X7v9kqJkGuE9_tf",
      "https://drive.google.com/drive/folders/1rzVdQ-e_SJcyyab8iAKxY3lwfSTcLPRP",
      "https://drive.google.com/drive/folders/1zjucfIXRiUGUYJn0nfo_CD6iI1Tary9T",
      "https://drive.google.com/file/d/1-2NL_4xaqTviAHpNwFJ4Flr-_ZMjkci6/view",
      "https://drive.google.com/drive/folders/1HZJtxRoEL0b3spJWUosRGKVYgTkH3kDC",
      "https://drive.google.com/drive/folders/1fYW4Oj54rmBxTDvlK7Vmvu2JwzptcSZY"
    ],
    "Python PYQs": [
      "https://drive.google.com/file/d/1Uwm4cbkrlgKTnu6nn81TIiuKsHSBqDD4/view",
      "https://drive.google.com/file/d/1zoaaADf6VO_x7fbAuO8bZtVeG4QTVcrH/view",
      "https://drive.google.com/file/d/16BvL5ztMlklu_twdy0a7uSUg2UU9HTHg/view",
      "https://drive.google.com/file/d/1Ky4Gma6-mpZzRwOpRgDcaF1wFN2lUx99/view",
      "https://drive.google.com/file/d/1WDzqOTnyHHuH5H0lLjm-NZ65GzicAHaJ/view",
      "https://drive.google.com/file/d/19S_nqMB-Tu2Nn4bKQmbcR_ljLO6iNT0e/view",
      "https://drive.google.com/file/d/1BKxwQeroA-lgvG-OTyKA_WX6QunGw4lf/view",
      "https://drive.google.com/file/d/13BDuujLg2sgPUG1893wEaXuXmxw67OSK/view"
    ]
  }
};

const baseDir = path.join(__dirname, 'temp_notes');

if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir);
}

Object.entries(data).forEach(([course, semesters]) => {
  const courseDir = path.join(baseDir, course);
  if (!fs.existsSync(courseDir)) {
    fs.mkdirSync(courseDir);
  }
  Object.entries(semesters).forEach(([sem, links]) => {
    const semDir = path.join(courseDir, sem);
    if (!fs.existsSync(semDir)) {
      fs.mkdirSync(semDir);
    }
    fs.writeFileSync(path.join(semDir, 'links.txt'), links.join('\n'));
  });
});

fs.writeFileSync(path.join(baseDir, 'all_extracted_materials.json'), JSON.stringify(data, null, 2));

console.log('Complete structure and all_extracted_materials.json created in temp_notes');
