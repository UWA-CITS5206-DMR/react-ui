import {
  apiClientV2,
  AuthToken,
  PaginatedResponse,
  Patient,
  BloodTestRequest,
  ObservationBundle,
} from "./api-client-v2";

// These compile-time assertions ensure that the public surface of the client
// stays aligned with the OpenAPI schema. No runtime code is executed.

type Expect<T extends true> = T;

type AssertLogin = Expect<
  Awaited<ReturnType<typeof apiClientV2.auth.login>> extends AuthToken ? true : false
>;

// List endpoints should resolve to paginated responses of the correct entity.
type AssertInstructorBloodTests = Expect<
  Awaited<ReturnType<typeof apiClientV2.instructors.bloodTestRequests.list>> extends
    PaginatedResponse<BloodTestRequest>
    ? true
    : false
>;

type AssertPatientList = Expect<
  Awaited<ReturnType<typeof apiClientV2.patients.list>> extends PaginatedResponse<Patient>
    ? true
    : false
>;

type AssertObservationBundle = Expect<
  Awaited<ReturnType<typeof apiClientV2.studentGroups.observations.createBundle>> extends
    ObservationBundle
    ? true
    : false
>;

type InstructorBloodTestListParams = Parameters<
  typeof apiClientV2.instructors.bloodTestRequests.list
>[0];

type AssertQueryParamTyping = Expect<
  InstructorBloodTestListParams extends
    | undefined
    | {
        page?: number;
        status?: string;
        [key: string]: unknown;
      }
    ? true
    : false
>;

// Prevent "declared but never used" errors by creating a composite type
// that references the assertions. This has no runtime effect.
type _AllAssertions = AssertLogin & AssertInstructorBloodTests & AssertPatientList & AssertObservationBundle & AssertQueryParamTyping;
const _assertionsPresent: _AllAssertions = true as unknown as _AllAssertions;
// Explicitly mark the composite type as used without affecting runtime behavior
void _assertionsPresent;
