/* eslint-disable react/sort-comp */
import React, {Component} from "react";
import Radium from "radium";
import debounce from "debounce";
import {Bling as Gpt, Events} from "react-gpt"; // eslint-disable-line import/no-unresolved
import "../log";
import Content from "./content";
import styles from "./styles";

Gpt.syncCorrelator();
Gpt.enableSingleRequest();
Gpt.disableInitialLoad();

@Radium
class App extends Component {
    state = {
        page: 1,
        size: [728, 90]
    }
    time = 0
    componentDidMount() {
        window.addEventListener("scroll", this.onScroll);
        window.addEventListener("resize", this.onScroll);
        this.onScroll();
        this.startTimer();
        Gpt.on(Events.RENDER, () => {
            let changeCorrelator = false;
            if (this.time >= 30) {
                changeCorrelator = true;
                this.startTimer();
            }
            Gpt.refresh(null, {changeCorrelator});
        });
    }
    componentDidUpdate() {
        Gpt.refresh();
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll);
        window.removeEventListener("resize", this.onScroll);
        this.stopTimer();
    }
    onScroll = debounce(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (scrollTop + window.innerHeight >= document.body.clientHeight) {
            this.setState({
                page: ++this.state.page
            });
        }
    }, 66)
    startTimer() {
        this.stopTimer();
        this.timer = setInterval(() => {
            this.time++;
        }, 1000);
    }
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.time = 0;
            this.timer = null;
        }
    }
    render() {
        const {page} = this.state;
        let contentCnt = 0;
        const contents = [];
        const targeting = {
            test: "infinitescroll"
        };
        while (contentCnt < page * 3) { // eslint-disable-line no-unmodified-loop-condition
            contents.push(
                <Content
                    key={contentCnt}
                    index={contentCnt % 3}
                    targeting={{
                        ...targeting,
                        count: `${Math.floor(contentCnt / 3)}`
                    }}
                />
            );
            contentCnt++;
        }
        return (
            <div>
                <div style={styles.lb}>
                    <Gpt
                        id="top-ad"
                        style={styles.adBorder}
                        adUnitPath="/4595/nfl.test.open"
                        slotSize={this.state.size}
                        targeting={targeting}
                    />
                </div>
                <div style={styles.main}>
                    {contents}
                </div>
            </div>
        );
    }
}

export default App;