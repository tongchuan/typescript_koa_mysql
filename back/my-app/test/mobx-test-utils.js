import { spy } from 'mobx';

// Utility function to capture all mobx events during a test
export const captureMobxEvents = (fn) => {
  const events = [];
  const disposer = spy(events.push.bind(events));
  
  return fn().finally(() => {
    disposer();
    return events;
  });
};

// Utility to check if a specific action occurred
export const didActionOccur = (events, actionName) => {
  return events.some(event => event.type === 'action' && event.name === actionName);
};

// Utility to check if a reaction occurred
export const didReactionOccur = (events, reactionName) => {
  return events.some(event => event.type === 'reaction' && event.name === reactionName);
};