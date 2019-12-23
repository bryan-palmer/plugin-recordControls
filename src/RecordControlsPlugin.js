import { FlexPlugin } from 'flex-plugin';
import React from 'react';
import RecordControlsComponent from './RecordControlsComponent';

const PLUGIN_NAME = 'RecordControlsPlugin';

export default class RecordControlsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    /**
     * Adds a new TaskCanvas Tab for voice calls
     */
    flex.TaskCanvasTabs.Content.add(
      <RecordControlsComponent label="Recording" key="recordingControls" />,
      {
        if: props => props.task.source.taskChannelUniqueName === "voice"
      }
    );
  }
}
