"use client"
import AttackMask from "@/public/AttackMask.png"
import AttackMask_p from "@/public/AttackMask_p.png"
import PowerMask from "@/public/PowerMask.png"
import PowerMask_p from "@/public/PowerMask_p.png"
import SKillMask from "@/public/SkillMask.png"
import SKillMask_p from "@/public/SkillMask_p.png"

const AttackMask_img = new Image();
const AttackMask_p_img = new Image();
const PowerMask_img = new Image();
const PowerMask_p_img = new Image();
const SkillMask_img = new Image();
const SkillMask_p_img = new Image();

function toDataURL(url: string | URL): Promise<any> {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                resolve(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = reject;
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    });
}

let promises = [
    toDataURL(AttackMask.src),
    toDataURL(AttackMask_p.src),
    toDataURL(PowerMask.src),
    toDataURL(PowerMask_p.src),
    toDataURL(SKillMask.src),
    toDataURL(SKillMask_p.src)
];

Promise.all(promises).then((dataUrls) => {
    AttackMask_img.src = dataUrls[0];
    AttackMask_p_img.src = dataUrls[1];
    PowerMask_img.src = dataUrls[2];
    PowerMask_p_img.src = dataUrls[3];
    SkillMask_img.src = dataUrls[4];
    SkillMask_p_img.src = dataUrls[5];

});


export const CardMask = {
    AttackMask: AttackMask_img,
    AttackMask_p: AttackMask_p_img,
    PowerMask: PowerMask_img,
    PowerMask_p: PowerMask_p_img,
    SkillMask: SkillMask_img,
    SkillMask_p: SkillMask_p_img
}


//创建三种卡牌的枚举类型

export enum CardType {
    Attack,
    Power,
    Skill,
    Unknown
}
