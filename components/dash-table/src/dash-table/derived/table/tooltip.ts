import * as R from 'ramda';

import {
    IUSerInterfaceTooltip,
    ITableHeaderTooltips,
    ITableStaticTooltips,
    IVirtualizedDerivedData,
    DataTooltips
} from 'dash-table/components/Table/props';
import {ifColumnId, ifRowIndex, ifFilter} from 'dash-table/conditional';
import {
    ConditionalTooltip,
    TooltipUsage,
    TooltipSyntax,
    Tooltip
} from 'dash-table/tooltips/props';
import {memoizeOne} from 'core/memoizer';

// 2^32-1 the largest value setTimout can take safely
export const MAX_32BITS = 2147483647;

function getSelectedTooltip(
    currentTooltip: IUSerInterfaceTooltip,
    tooltip_data: DataTooltips,
    tooltip_header: ITableHeaderTooltips,
    tooltip_conditional: ConditionalTooltip[],
    tooltip_static: ITableStaticTooltips,
    virtualized: IVirtualizedDerivedData
) {
    if (!currentTooltip) {
        return undefined;
    }

    // vx, header is a boolean, indicating whether it is header row, id is the column id, row is the row index
    // (in the original data array pre-filtering/sorting)
    const {header, id, row} = currentTooltip;

    if (id === undefined || row === undefined) {
        return undefined;
    }
    const realRowIdx = virtualized.indices[row - virtualized.offset.rows];

    console.log('vx', {header, id, row, virtualized})
    const conditionalTooltips = header
        ? undefined
        : R.findLast(tt => {
              return (
                  !tt.if ||
                  (ifColumnId(tt.if, id) &&
                      ifRowIndex(tt.if, realRowIdx) &&
                      ifFilter(
                          tt.if,
                          virtualized.data[row - virtualized.offset.rows]
                      ))
              );
          }, tooltip_conditional);

    if (conditionalTooltips) {
        return conditionalTooltips;
    }

    let tooltip: Tooltip | null | undefined;

    if (header) {
        const headerTooltip = tooltip_header?.[id];
        tooltip = Array.isArray(headerTooltip)
            ? headerTooltip?.[row]
            : headerTooltip;
    } else {
        tooltip = tooltip_data?.[realRowIdx]?.[id];
    }

    if (tooltip) {
        return tooltip;
    }

    const staticTooltip = tooltip_static?.[id];
    const staticUseWith =
        staticTooltip && typeof staticTooltip !== 'string'
            ? staticTooltip.use_with
            : TooltipUsage.Both;
    const staticApplicable =
        staticUseWith === TooltipUsage.Both ||
        (staticUseWith === TooltipUsage.Header) === header;
    const resolvedStaticTooltip = staticApplicable ? staticTooltip : undefined;

    return resolvedStaticTooltip;
}

function convertDelay(delay: number | null) {
    return typeof delay === 'number' ? delay : 0;
}

function convertDuration(duration: number | null) {
    return typeof duration === 'number' ? duration : MAX_32BITS;
}

function getDelay(delay: number | null | undefined, defaultTo: number) {
    return typeof delay === 'number' || delay === null
        ? convertDelay(delay)
        : defaultTo;
}

function getDuration(duration: number | null | undefined, defaultTo: number) {
    return typeof duration === 'number' || duration === null
        ? convertDuration(duration)
        : defaultTo;
}

export default memoizeOne(
    (
        currentTooltip: IUSerInterfaceTooltip,
        tooltip_data: DataTooltips,
        tooltip_header: ITableHeaderTooltips,
        tooltip_conditional: ConditionalTooltip[],
        tooltip_static: ITableStaticTooltips,
        virtualized: IVirtualizedDerivedData,
        defaultDelay: number | null,
        defaultDuration: number | null
    ) => {
        const selectedTooltip = getSelectedTooltip(
            currentTooltip,
            tooltip_data,
            tooltip_header,
            tooltip_conditional,
            tooltip_static,
            virtualized
        );

        let delay = convertDelay(defaultDelay) as number;
        let duration = convertDuration(defaultDuration) as number;

        let type: TooltipSyntax = TooltipSyntax.Text;
        let value: string | undefined;

        if (selectedTooltip) {
            if (typeof selectedTooltip === 'string') {
                value = selectedTooltip;
            } else {
                delay = getDelay(selectedTooltip.delay, delay);
                duration = getDuration(selectedTooltip.duration, duration);
                type = selectedTooltip.type || TooltipSyntax.Text;
                value = selectedTooltip.value;
            }
        }

        return {delay, duration, type, value};
    }
);
