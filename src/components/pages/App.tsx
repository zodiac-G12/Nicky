import React, {useState, useCallback} from 'react';
import styled, {keyframes} from 'styled-components';
import marked from 'marked';
import UseEventListener from '../atoms/UseEventListener';
import Container from '../atoms/Container';

const sleep = (n) => new Promise(resolve => setTimeout(resolve, n));


let flag = false,
    direction = 0;

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
        direction = 37;
        flag = true;
        await sleep(550);
        flag = false;
    } else if (e.deltaX < -100) {
        direction = 39;
        flag = true;
        await sleep(550);
        flag = false;
    }
}

let indexX;

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
        direction = 39;
        flag = true;
        await sleep(550);
        flag = false;
        indexX = undefined;
    } else if (indexX > clientX && indexX - clientX > 100) {
        direction = 37;
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
    const content = marked("# Test");
    const [flags, sf] = useState(false);
    const [directions, sd] = useState(0);

    const handlerTS = useCallback(async(e) => {
        console.log("handlerTS")
        ontouchstart(e);

        sf(flag);
        sd(direction);
    }, []);
    const handlerT = useCallback(async(e) => {
        console.log("handlerT")
        ontouchend(e);

        sf(flag);
        sd(direction);

        if (flag) await sleep(600);

        sf(flag);
        sd(direction);
    }, []);
    const handlerK = useCallback(async(e) => {
        console.log("handlerK")
        onkeydown(e);

        sf(flag);
        sd(direction);

        if (flag) await sleep(600);

        sf(flag);
        sd(direction);
    }, []);
    const handlerW = useCallback(async(e) => {
        console.log("handlerW")
        onwheel(e);

        sf(flag);
        sd(direction);

        if (flag) await sleep(600);

        sf(flag);
        sd(direction);
    }, []);

    UseEventListener('wheel', handlerW);
    UseEventListener('keydown', handlerK);
    UseEventListener('touchstart', handlerTS);
    UseEventListener('touchend', handlerT);
    UseEventListener('mouseup', handlerT);
    UseEventListener('mousedown', handlerTS);

    return (
        <Container> 
            <Md
                flag={flags}
                direction={directions}
                dangerouslySetInnerHTML={{__html: content}}>
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
    width: 100%;
    height: 100%;
    background: red;
    animation: ${props => {
        if (!props.flag) return "none";
        if (props.direction === 37) {
            return leftshift;
        } else if(props.direction === 39) {
            return rightshift;
        } else return "none";
    }} 0.5s ease-out forwards;
`;


export default App;
