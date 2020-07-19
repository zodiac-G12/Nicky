import React, {useState, useCallback} from 'react';
import styled, {keyframes} from 'styled-components';
import marked from 'marked';
import UseEventListener from '../atoms/UseEventListener';
import Container from '../atoms/Container';

const sleep = (n) => new Promise(resolve => setTimeout(resolve, n));


let flag = false,
    direction = 0,
    indexX;

const onkeydown = async(e) => {
    console.log("onkeydown", e);
    const keyCode = e.keyCode;
    if (![37,39].includes(keyCode)) return;
    if (flag) return;
    if (keyCode === 37) {
        direction = 37;
        flag = true;
        await sleep(550);
        flag = false;
    } else if (keyCode === 39) {
        direction = 39;
        flag = true;
        await sleep(550);
        flag = false;
    }
}

const onwheel = async(e) => {
    if (flag) return;

    if (e.deltaX > 100) {
        direction = 39;
        flag = true;
        await sleep(550);
        flag = false;
    } else if (e.deltaX < -100) {
        direction = 37;
        flag = true;
        await sleep(550);
        flag = false;
    }
}


const ontouchstart = async(e) => {
    if (flag) return;

    if (e.changedTouches) {
        indexX = e.changedTouches[0].clientX;
    } else indexX = e.clientX;
}
const ontouchend = async(e) => {

    if (flag) return;

    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;

    if (indexX < clientX && clientX - indexX > 100) {
        direction = 37;
        flag = true;
        await sleep(550);
        flag = false;
        indexX = undefined;
    } else if (indexX > clientX && indexX - clientX > 100) {
        direction = 39;
        flag = true;
        await sleep(550);
        flag = false;
        indexX = undefined;
    } else {
        flag = false;
        indexX = undefined;
    }

}

const App = () => {
    const content1 = marked("# left");
    const content3 = marked("# right");

    const [centerContent, setContent] = useState(marked("# center"));
    const [flags, sf] = useState(false);
    const [directions, sd] = useState(0);

    const handlerTS = useCallback(async(e) => {
        console.log("handlerTS")
        ontouchstart(e);

        sf(flag);
        sd(direction);
    }, []);
    const handler = useCallback(async(e,fnc) => {
        console.log(String(fnc.name))
        fnc(e);

        sf(flag);
        sd(direction);

        if (flag) await sleep(600);

        if (direction===37) setContent(content1);
        if (direction===39) setContent(content3);
        sf(flag);
        sd(direction);
    }, []);

    [{evName: "wheel", fuc: onwheel},
        {evName: "keydown", fuc: onkeydown},
        {evName: "touchend", fuc: ontouchend},
        {evName: "mouseup", fuc: ontouchend}].forEach((item) => {
        UseEventListener(item.evName, (e)=>{handler(e,item.fuc)});
    })

    UseEventListener('touchstart', handlerTS);
    UseEventListener('mousedown', handlerTS);

    return (
        <Container> 
            <Md
                left={"0"}
                time={"0.5s"}
                flag={flags}
                direction={directions}
                dangerouslySetInnerHTML={{__html: centerContent}}>
            </Md>
            <Md
                left={"-100vw"}
                time={"0.5s"}
                flag={flags}
                direction={directions}
                dangerouslySetInnerHTML={{__html: content1}}>
            </Md>
            <Md
                left={"100vw"}
                time={"0.5s"}
                flag={flags}
                direction={directions}
                dangerouslySetInnerHTML={{__html: content3}}>
            </Md>
        </Container>
    );
};

const leftshift = keyframes`
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-100vw);
    }
`;
const rightshift = keyframes`
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(100vw);
    }
`;

const Md = styled.div`
    left: ${props=>{return props.left}};
    overflow: hidden;
    width: 90vw;
    position: absolute;
    margin: 5vw;
    height: 80vh;
    background: red;
    animation: ${props => {
        if (!props.flag) return "none";
        if (props.direction === 37) {
            return rightshift;
        } else if(props.direction === 39) {
            return leftshift;
        } else return "none";
    }} ${props=>{return props.time}} ease forwards;
`;


export default App;
