import React, {FC} from "react";
import {ButtonGroup, ToggleButton} from "react-bootstrap";
import {ClientType} from "tlm-common";

export interface Props {
  onChange: (value: number | ClientType) => void;
  value: -1 | ClientType;
}

export const ClientTypeSwitch: FC<Props> = ({onChange, value}) => {
  return (
    <ButtonGroup toggle size="sm">
      <ToggleButton name="ctypeRadio"
                    value={-1}
                    onClick={() => onChange(-1)}
                    type="radio"
                    checked={value < 0}>
        All
      </ToggleButton>
      <ToggleButton name="ctypeRadio"
                    value={ClientType.active}
                    onClick={() => onChange(ClientType.active)}
                    type="radio"
                    checked={value === ClientType.active}>
        Active
      </ToggleButton>
      <ToggleButton
        name="ctypeRadio"
        value={ClientType.lead}
        onClick={() => onChange(ClientType.lead)}
        type="radio"
        checked={value === ClientType.lead}>
        Leads
      </ToggleButton>
    </ButtonGroup>
  )
}
