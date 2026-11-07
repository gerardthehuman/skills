# Mutation Probes

A mutation probe deliberately changes behavior to measure whether selected tests detect the fault.
Use it only to resolve a specific uncertainty from the test-quality review.

## Run a Probe

If permitted execution and a disposable copy are available, perform these steps there.
Otherwise, describe the proposed check and its evidence limit.
Keep all temporary changes outside the target source.

1. Establish a passing baseline for the selected tests at the reviewed snapshot.
2. Check that test discovery includes the intended tests.
3. Choose a reachable mutation that violates the relevant contract.
4. Apply the mutation to the disposable copy.
5. Run the selected tests and inspect the result.
6. Discard temporary changes and retain the evidence needed for the recommendation.

If the baseline or discovery check fails, stop and report that limitation.
A mutation is killed only when the selected tests fail because of the intended fault.

## Interpret the Evidence

A killed mutation supports only the exercised fault and scenario.
A surviving mutation suggests a gap, not proof that the test lacks value.
Equivalent behavior, unreachable mutations, and unrelated failures are inconclusive.
Label supplied probe results separately from experiments performed during this review.

Completion: the result records the baseline, selected tests, mutation, observed response, and justified conclusion.
