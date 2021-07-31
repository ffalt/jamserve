import useragent from 'express-useragent';
export function parseAgent(session) {
    try {
        return useragent.parse(session.agent);
    }
    catch (e) {
    }
    return;
}
//# sourceMappingURL=session.utils.js.map